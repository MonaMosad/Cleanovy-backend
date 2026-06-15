const Service = require("../models/serviceModel");
const ProviderService = require("../models/providerServiceModel");
const {
  SERVICE_CATALOG,
  LEGACY_SERVICE_TO_CATEGORY,
  CATEGORY_NAMES,
  LEGACY_ENGLISH_CATEGORIES,
} = require("../data/serviceCatalog");

/**
 * Idempotent seed/migration:
 * - Ensures 5 admin categories exist (parent: null, provider: null)
 * - Ensures catalog child services exist under each category
 * - Reparents legacy flat services that were wrongly top-level
 * - Migrates English legacy categories
 */
async function seedServiceCategories() {
  const categoryMap = {};

  for (const cat of SERVICE_CATALOG) {
    let category = await Service.findOne({
      name: cat.name,
      parent: null,
      provider: null,
    });

    if (!category) {
      category = await Service.create({
        name: cat.name,
        icon: cat.icon,
        parent: null,
        provider: null,
        is_active: true,
      });
    } else if (!category.icon && cat.icon) {
      category.icon = cat.icon;
      await category.save();
    }

    categoryMap[cat.name] = category;

    for (const child of cat.children) {
      const existingChild = await Service.findOne({
        name: child.name,
        parent: category._id,
        provider: null,
      });

      if (!existingChild) {
        const orphan = await Service.findOne({
          name: child.name,
          provider: null,
          parent: { $ne: category._id },
        });

        if (orphan) {
          orphan.parent = category._id;
          orphan.unit = child.unit;
          orphan.is_active = true;
          await orphan.save();
        } else {
          await Service.create({
            name: child.name,
            parent: category._id,
            provider: null,
            unit: child.unit,
            is_active: true,
          });
        }
      }
    }
  }

  // Reparent legacy flat admin services (parent: null but not a category)
  const flatServices = await Service.find({
    parent: null,
    provider: null,
    name: { $nin: CATEGORY_NAMES },
  });

  for (const svc of flatServices) {
    const targetCategoryName = LEGACY_SERVICE_TO_CATEGORY[svc.name];
    if (targetCategoryName && categoryMap[targetCategoryName]) {
      svc.parent = categoryMap[targetCategoryName]._id;
      await svc.save();
      continue;
    }

    // English legacy child services under English categories
    if (svc.name.includes("Washing") || svc.name.includes("Ironing")) {
      svc.parent = categoryMap["ملابس"]._id;
      await svc.save();
    } else if (svc.name.includes("Dry Cleaning")) {
      svc.parent = categoryMap["ملابس"]._id;
      await svc.save();
    }
  }

  // Migrate English legacy categories: move children then deactivate category
  for (const legacyName of LEGACY_ENGLISH_CATEGORIES) {
    const legacyCat = await Service.findOne({
      name: legacyName,
      parent: null,
      provider: null,
    });
    if (!legacyCat) continue;

    const children = await Service.find({ parent: legacyCat._id });
    for (const child of children) {
      if (!child.parent || child.parent.toString() === legacyCat._id.toString()) {
        child.parent = categoryMap["ملابس"]._id;
        await child.save();
      }
    }

    const linkedCount = await ProviderService.countDocuments({ service: legacyCat._id });
    if (linkedCount === 0) {
      await Service.findByIdAndDelete(legacyCat._id);
    } else {
      legacyCat.is_active = false;
      await legacyCat.save();
    }
  }

  // Deactivate any remaining non-catalog top-level admin services
  await Service.updateMany(
    {
      parent: null,
      provider: null,
      name: { $nin: CATEGORY_NAMES },
    },
    { is_active: false }
  );

  return categoryMap;
}

module.exports = { seedServiceCategories };
