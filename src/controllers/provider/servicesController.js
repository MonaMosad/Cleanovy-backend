

// controllers/provider/servicesController.js
const ProviderService = require("../../models/providerServiceModel");
const Service = require("../../models/serviceModel");
const mongoose = require("mongoose");

// ─────────────────────────────────────────────────────────────────
//  CATEGORIES
// ─────────────────────────────────────────────────────────────────

/**
 * GET /provider/services/categories
 * Returns all categories visible to this provider:
 *   - admin/basic categories (provider: null)
 *   - categories this provider created (provider: providerId)
 * Each category includes a count of how many services this provider has under it.
 */
const getCategories = async (req, res) => {
  try {
    const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");

    // Get all categories visible to this provider
    const categories = await Service.find({
      parent: null,
      $or: [{ provider: null }, { provider: providerId }],
    }).select("name icon provider");

    // Get this provider's services to count per category
    const providerServices = await ProviderService.find({
      provider: providerId,
    }).populate("service", "parent");

    // Build count map: categoryId -> count
    const countMap = {};
    providerServices.forEach((ps) => {
      const parentId = ps.service?.parent?.toString();
      if (parentId) {
        countMap[parentId] = (countMap[parentId] || 0) + 1;
      }
    });

    const result = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      icon: cat.icon,
      isBasic: cat.provider === null, // true = admin category, can't be deleted
      count: countMap[cat._id.toString()] || 0,
    }));

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /provider/services/categories
 * Provider creates a new category.
 * Body: { name, icon? }
 */
const addCategory = async (req, res) => {
  try {
    const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
    const { name, icon } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "اسم التصنيف مطلوب" });
    }

    const category = await Service.create({
      name,
      icon: icon || "",
      parent: null,
      provider: providerId, // provider-created, not admin
    });

    res.status(201).json({ success: true, message: "تم إضافة التصنيف", data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /provider/services/categories/:id
 * Provider deletes a category they created.
 * Blocked if: admin category OR has services under it.
 */
const deleteCategory = async (req, res) => {
  try {
    const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
    const categoryId = new mongoose.Types.ObjectId(req.params.id);

    const category = await Service.findById(categoryId);

    if (!category) {
      return res.status(404).json({ success: false, message: "التصنيف مش موجود" });
    }

    // Block deleting admin/basic categories
    if (category.provider === null || category.provider === undefined) {
      return res.status(403).json({
        success: false,
        message: "لا يمكن حذف تصنيف أساسي",
      });
    }

    // Block if provider doesn't own this category
    if (category.provider.toString() !== providerId.toString()) {
      return res.status(403).json({ success: false, message: "مش مسموح" });
    }

    // Block if services exist under this category
    const servicesUnder = await Service.countDocuments({
      parent: categoryId,
      provider: providerId,
    });

    if (servicesUnder > 0) {
      return res.status(409).json({
        success: false,
        message: `يوجد ${servicesUnder} خدمة تحت هذا التصنيف، احذفهم أولاً`,
      });
    }

    await Service.findByIdAndDelete(categoryId);

    res.status(200).json({ success: true, message: "تم حذف التصنيف" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────
//  SERVICES
// ─────────────────────────────────────────────────────────────────

/**
 * GET /provider/services
 * Returns all provider services with category info.
 * Query: ?category=<categoryId>  ?active=true|false
 */
const getServices = async (req, res) => {
  try {
    const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");

    const filter = { provider: providerId };
    if (req.query.active !== undefined) {
      filter.is_active = req.query.active === "true";
    }

    const providerServices = await ProviderService.find(filter).populate({
      path: "service",
      select: "name description icon parent duration_hours unit",
      populate: { path: "parent", select: "name icon" },
    });

    // Filter by category after populate
    let result = providerServices;
    if (req.query.category) {
      result = providerServices.filter(
        (ps) => ps.service?.parent?._id?.toString() === req.query.category
      );
    }

    // ── Stats ────────────────────────────────────────────────────
    const totalServices = result.length;
    const fastServiceCount = result.filter((ps) => ps.fast_service).length;
    const fastServicePct =
      totalServices > 0 ? Math.round((fastServiceCount / totalServices) * 100) : 0;
    const avgPrice =
      totalServices > 0
        ? Math.round((result.reduce((s, ps) => s + ps.price, 0) / totalServices) * 100) / 100
        : 0;

    res.status(200).json({
      success: true,
      count: totalServices,
      stats: { totalServices, fastServicePct, avgPrice },
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /provider/services/:id
 * Single provider service by ProviderService _id
 */
const getServiceById = async (req, res) => {
  try {
    const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
    const serviceId = new mongoose.Types.ObjectId(req.params.id);

    const providerService = await ProviderService.findOne({
      _id: serviceId,
      provider: providerId,
    }).populate({
      path: "service",
      select: "name description icon parent duration_hours unit",
      populate: { path: "parent", select: "name icon" },
    });

    if (!providerService) {
      return res.status(404).json({ success: false, message: "الخدمة مش موجودة" });
    }

    res.status(200).json({ success: true, data: providerService });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /provider/services
 * Provider creates a new service from scratch.
 * Body: {
 *   categoryId,       ← parent category _id
 *   name,             ← service name (provider writes it)
 *   description?,
 *   icon?,
 *   duration_hours?,  ← 6, 12, 24, 48, 72
 *   unit?,
 *   price,
 *   fast_service?,
 *   fast_multiplier?,
 *   is_active?
 * }
 */
const addService = async (req, res) => {
  try {
    const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");

    const {
      categoryId,
      name,
      description,
      icon,
      duration_hours,
      unit,
      price,
      fast_service,
      fast_multiplier,
      is_active,
    } = req.body;

    if (!categoryId || !name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "categoryId واسم الخدمة والسعر مطلوبين",
      });
    }

    // Validate category exists and is visible to this provider
    const category = await Service.findOne({
      _id: categoryId,
      parent: null,
      $or: [{ provider: null }, { provider: providerId }],
    });

    if (!category) {
      return res.status(404).json({ success: false, message: "التصنيف مش موجود" });
    }

    // Step 1: Create the Service document
    const newService = await Service.create({
      name,
      description: description || "",
      icon: icon || "",
      parent: categoryId,
      provider: providerId,
      duration_hours: duration_hours ?? 24,
      unit: unit || "per_piece",
      is_active: is_active !== undefined ? is_active : true,
    });

    // Step 2: Create the ProviderService document (price + fast service)
    const newProviderService = await ProviderService.create({
      provider: providerId,
      service: newService._id,
      price,
      fast_service: fast_service ?? false,
      fast_multiplier: fast_multiplier ?? 1.5,
      is_active: is_active !== undefined ? is_active : true,
    });

    const populated = await newProviderService.populate({
      path: "service",
      select: "name description icon parent duration_hours unit",
      populate: { path: "parent", select: "name icon" },
    });

    res.status(201).json({
      success: true,
      message: "تمت إضافة الخدمة بنجاح",
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /provider/services/:id
 * Update ProviderService fields (price, fast_service, is_active)
 * and/or Service fields (name, description, duration_hours).
 * Body: any subset of the above.
 */
const updateService = async (req, res) => {
  try {
    const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
    const providerServiceId = new mongoose.Types.ObjectId(req.params.id);

    const providerService = await ProviderService.findOne({
      _id: providerServiceId,
      provider: providerId,
    });

    if (!providerService) {
      return res.status(404).json({ success: false, message: "الخدمة مش موجودة" });
    }

    // Update ProviderService fields
    const psFields = ["price", "fast_service", "fast_multiplier", "is_active"];
    psFields.forEach((f) => {
      if (req.body[f] !== undefined) providerService[f] = req.body[f];
    });
    await providerService.save();

    // Update Service fields (only provider-created services)
    const svcFields = ["name", "description", "icon", "duration_hours", "unit"];
    const svcUpdates = {};
    svcFields.forEach((f) => {
      if (req.body[f] !== undefined) svcUpdates[f] = req.body[f];
    });

    if (Object.keys(svcUpdates).length > 0) {
      await Service.findOneAndUpdate(
        { _id: providerService.service, provider: providerId }, // only own services
        svcUpdates
      );
    }

    const populated = await providerService.populate({
      path: "service",
      select: "name description icon parent duration_hours unit",
      populate: { path: "parent", select: "name icon" },
    });

    res.status(200).json({ success: true, message: "تم تحديث الخدمة", data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /provider/services/:id
 * Deletes both the ProviderService and the Service document (if provider-created).
 */
const deleteService = async (req, res) => {
  try {
    const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
    const providerServiceId = new mongoose.Types.ObjectId(req.params.id);

    const providerService = await ProviderService.findOneAndDelete({
      _id: providerServiceId,
      provider: providerId,
    });

    if (!providerService) {
      return res.status(404).json({ success: false, message: "الخدمة مش موجودة" });
    }

    // Also delete the Service document if it was created by this provider
    await Service.findOneAndDelete({
      _id: providerService.service,
      provider: providerId,
    });

    res.status(200).json({ success: true, message: "تم حذف الخدمة بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  addCategory,
  deleteCategory,
  getServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
};