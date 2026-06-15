// // controllers/provider/discountsController.js
// const DiscountTier = require("../../models/discountTierModel");
// const SpecialEntityDiscount = require("../../models/specialEntityDiscountModel");
// const mongoose = require("mongoose");


// /**
//  * GET /provider/discounts/tiers
//  * All discount tiers for this provider, sorted by minQty.
//  */
// const getDiscountTiers = async (req, res) => {
//   try {
//     // const providerId = req.user.id;
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");

//     const tiers = await DiscountTier.find({ provider: providerId }).sort({ minQty: 1 });

//     res.status(200).json({ success: true, count: tiers.length, data: tiers });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * POST /provider/discounts/tiers
//  * Create a new discount tier.
//  * Body: { name, minQty, maxQty?, discount, color?, is_active? }
//  */
// const createDiscountTier = async (req, res) => {
//   try {
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
//     const { name, minQty, maxQty, discount, color, is_active } = req.body;

//     if (!name || minQty === undefined || discount === undefined) {
//       return res.status(400).json({
//         success: false,
//         message: "الاسم والحد الأدنى ونسبة الخصم مطلوبين",
//       });
//     }

//     // Validate no overlap with existing tiers
//     const existing = await DiscountTier.find({ provider: providerId });
//     const hasOverlap = existing.some((t) => {
//       const newMin = Number(minQty);
//       const newMax = maxQty !== undefined && maxQty !== null ? Number(maxQty) : Infinity;
//       const tMax = t.maxQty !== null ? t.maxQty : Infinity;
//       return newMin <= tMax && newMax >= t.minQty;
//     });

//     if (hasOverlap) {
//       return res.status(409).json({
//         success: false,
//         message: "نطاق الكميات متداخل مع مستوى موجود",
//       });
//     }

//     const tier = await DiscountTier.create({
//       provider: providerId,
//       name,
//       minQty,
//       maxQty: maxQty !== undefined ? maxQty : null,
//       discount,
//       color: color || "bg-slate-300",
//       is_active: is_active !== undefined ? is_active : true,
//     });

//     res.status(201).json({ success: true, message: "تمت إضافة مستوى الخصم", data: tier });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * PATCH /provider/discounts/tiers/:id
//  * Update a tier's discount %, name, active status, etc.
//  * Body: any subset of { name, discount, is_active, color, minQty, maxQty }
//  */
// const updateDiscountTier = async (req, res) => {
//   try {
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
//     const tierId = new mongoose.Types.ObjectId(req.params.id);

//     const allowedFields = ["name", "discount", "is_active", "color", "minQty", "maxQty"];
//     const updates = {};
//     allowedFields.forEach((f) => {
//       if (req.body[f] !== undefined) updates[f] = req.body[f];
//     });

//     if (Object.keys(updates).length === 0) {
//       return res.status(400).json({ success: false, message: "لا توجد بيانات للتحديث" });
//     }

//     const updated = await DiscountTier.findOneAndUpdate(
//       { _id: tierId, provider: providerId },
//       updates,
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ success: false, message: "المستوى مش موجود" });
//     }

//     res.status(200).json({ success: true, message: "تم تحديث مستوى الخصم", data: updated });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * PATCH /provider/discounts/tiers/:id/toggle
//  * Toggle is_active for a tier (quick shortcut from the frontend table).
//  */
// const toggleDiscountTier = async (req, res) => {
//   try {
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
//     const tierId = new mongoose.Types.ObjectId(req.params.id);

//     const tier = await DiscountTier.findOne({ _id: tierId, provider: providerId });

//     if (!tier) {
//       return res.status(404).json({ success: false, message: "المستوى مش موجود" });
//     }

//     tier.is_active = !tier.is_active;
//     await tier.save();

//     res.status(200).json({
//       success: true,
//       message: `تم ${tier.is_active ? "تفعيل" : "إيقاف"} المستوى`,
//       data: tier,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * DELETE /provider/discounts/tiers/:id
//  */
// const deleteDiscountTier = async (req, res) => {
//   try {
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
//     const tierId = new mongoose.Types.ObjectId(req.params.id);

//     const deleted = await DiscountTier.findOneAndDelete({
//       _id: tierId,
//       provider: providerId,
//     });

//     if (!deleted) {
//       return res.status(404).json({ success: false, message: "المستوى مش موجود" });
//     }

//     res.status(200).json({ success: true, message: "تم حذف مستوى الخصم" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ═══════════════════════════════════════════════
// //  SPECIAL ENTITY DISCOUNTS (خصومات الجهات الخاصة)
// // ═══════════════════════════════════════════════

// /**
//  * GET /provider/discounts/special-entities
//  */
// const getSpecialEntities = async (req, res) => {
//   try {
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");

//     const entities = await SpecialEntityDiscount.find({ provider: providerId });

//     res.status(200).json({ success: true, count: entities.length, data: entities });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * PATCH /provider/discounts/special-entities/:id
//  * Update discount value or enabled state.
//  * Body: { discount?, is_enabled? }
//  */
// const updateSpecialEntity = async (req, res) => {
//   try {
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
//     const entityId = new mongoose.Types.ObjectId(req.params.id);

//     const allowedFields = ["discount", "is_enabled"];
//     const updates = {};
//     allowedFields.forEach((f) => {
//       if (req.body[f] !== undefined) updates[f] = req.body[f];
//     });

//     if (Object.keys(updates).length === 0) {
//       return res.status(400).json({ success: false, message: "لا توجد بيانات للتحديث" });
//     }

//     const updated = await SpecialEntityDiscount.findOneAndUpdate(
//       { _id: entityId, provider: providerId },
//       updates,
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ success: false, message: "الجهة مش موجودة" });
//     }

//     res.status(200).json({ success: true, message: "تم تحديث خصم الجهة", data: updated });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * POST /provider/discounts/special-entities/save-all
//  * Bulk upsert — matches how the frontend sends all entities at once.
//  * Body: { entities: [{ entityKey, label, icon, sub, discount, is_enabled }, ...] }
//  */
// const saveAllSpecialEntities = async (req, res) => {
//   try {
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
//     const { entities } = req.body;

//     if (!Array.isArray(entities) || entities.length === 0) {
//       return res.status(400).json({ success: false, message: "entities array مطلوبة" });
//     }

//     const ops = entities.map((e) => ({
//       updateOne: {
//         filter: { provider: providerId, entityKey: e.entityKey },
//         update: {
//           $set: {
//             label: e.label,
//             icon: e.icon,
//             sub: e.sub,
//             discount: e.discount,
//             is_enabled: e.is_enabled,
//           },
//         },
//         upsert: true,
//       },
//     }));

//     await SpecialEntityDiscount.bulkWrite(ops);

//     const updated = await SpecialEntityDiscount.find({ provider: providerId });

//     res.status(200).json({
//       success: true,
//       message: "تم حفظ خصومات الجهات الخاصة",
//       data: updated,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * GET /provider/discounts/simulate?qty=<number>
//  * Returns which tier applies and how much the discount is.
//  * Used by the discount simulator in the frontend.
//  */
// const simulateDiscount = async (req, res) => {
//   try {
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
//     const qty = Number(req.query.qty);

//     if (!qty || qty < 1) {
//       return res.status(400).json({ success: false, message: "qty مطلوب وأكبر من 0" });
//     }

//     const tiers = await DiscountTier.find({ provider: providerId, is_active: true }).sort({
//       discount: -1,
//     });

//     let appliedTier = null;
//     for (const tier of tiers) {
//       const maxOk = tier.maxQty === null || qty <= tier.maxQty;
//       if (qty >= tier.minQty && maxOk) {
//         appliedTier = tier;
//         break;
//       }
//     }

//     const discountPct = appliedTier ? appliedTier.discount : 0;
//     const tierName = appliedTier ? appliedTier.name : "Standard";

//     res.status(200).json({
//       success: true,
//       data: {
//         qty,
//         tierName,
//         discountPct,
//         appliedTier,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = {
//   getDiscountTiers,
//   createDiscountTier,
//   updateDiscountTier,
//   toggleDiscountTier,
//   deleteDiscountTier,
//   getSpecialEntities,
//   updateSpecialEntity,
//   saveAllSpecialEntities,
//   simulateDiscount,
// };











const DiscountTier = require("../../models/discountTierModel");
const SpecialEntityDiscount = require("../../models/specialEntityDiscountModel");

const getDiscountTiers = async (req, res) => {
  try {
    const providerId = req.user._id;
    const tiers = await DiscountTier.find({ provider: providerId }).sort({ minQty: 1 });
    res.status(200).json({ success: true, count: tiers.length, data: tiers });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const createDiscountTier = async (req, res) => {
  try {
    const providerId = req.user._id;
    const { name, minQty, maxQty, discount, color, is_active } = req.body;
    if (!name || minQty === undefined || discount === undefined)
      return res.status(400).json({ success: false, message: "الاسم والحد الأدنى ونسبة الخصم مطلوبين" });

    const existing = await DiscountTier.find({ provider: providerId });
    const hasOverlap = existing.some((t) => {
      const newMin = Number(minQty);
      const newMax = maxQty !== undefined && maxQty !== null ? Number(maxQty) : Infinity;
      const tMax = t.maxQty !== null ? t.maxQty : Infinity;
      return newMin <= tMax && newMax >= t.minQty;
    });
    if (hasOverlap) return res.status(409).json({ success: false, message: "نطاق الكميات متداخل مع مستوى موجود" });

    const tier = await DiscountTier.create({
      provider: providerId, name, minQty,
      maxQty: maxQty !== undefined ? maxQty : null,
      discount, color: color || "bg-slate-300",
      is_active: is_active !== undefined ? is_active : true,
    });
    res.status(201).json({ success: true, message: "تمت إضافة مستوى الخصم", data: tier });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const updateDiscountTier = async (req, res) => {
  try {
    const providerId = req.user._id;
    const allowedFields = ["name", "discount", "is_active", "color", "minQty", "maxQty"];
    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    if (Object.keys(updates).length === 0)
      return res.status(400).json({ success: false, message: "لا توجد بيانات للتحديث" });

    const updated = await DiscountTier.findOneAndUpdate(
      { _id: req.params.id, provider: providerId }, updates, { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "المستوى مش موجود" });
    res.status(200).json({ success: true, message: "تم تحديث مستوى الخصم", data: updated });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const toggleDiscountTier = async (req, res) => {
  try {
    const providerId = req.user._id;
    const tier = await DiscountTier.findOne({ _id: req.params.id, provider: providerId });
    if (!tier) return res.status(404).json({ success: false, message: "المستوى مش موجود" });
    tier.is_active = !tier.is_active;
    await tier.save();
    res.status(200).json({ success: true, message: `تم ${tier.is_active ? "تفعيل" : "إيقاف"} المستوى`, data: tier });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const deleteDiscountTier = async (req, res) => {
  try {
    const deleted = await DiscountTier.findOneAndDelete({ _id: req.params.id, provider: req.shop._id });
    if (!deleted) return res.status(404).json({ success: false, message: "المستوى مش موجود" });
    res.status(200).json({ success: true, message: "تم حذف مستوى الخصم" });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const getSpecialEntities = async (req, res) => {
  try {
    const entities = await SpecialEntityDiscount.find({ provider: req.shop._id });
    res.status(200).json({ success: true, count: entities.length, data: entities });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const updateSpecialEntity = async (req, res) => {
  try {
    const allowedFields = ["discount", "is_enabled"];
    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const updated = await SpecialEntityDiscount.findOneAndUpdate(
      { _id: req.params.id, provider: req.user._id }, updates, { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "الجهة مش موجودة" });
    res.status(200).json({ success: true, message: "تم تحديث خصم الجهة", data: updated });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const saveAllSpecialEntities = async (req, res) => {
  try {
    const providerId = req.user._id;
    const { entities } = req.body;
    if (!Array.isArray(entities) || entities.length === 0)
      return res.status(400).json({ success: false, message: "entities array مطلوبة" });

    const ops = entities.map((e) => ({
      updateOne: {
        filter: { provider: providerId, entityKey: e.entityKey },
        update: { $set: { label: e.label, icon: e.icon, sub: e.sub, discount: e.discount, is_enabled: e.is_enabled } },
        upsert: true,
      },
    }));
    await SpecialEntityDiscount.bulkWrite(ops);
    const updated = await SpecialEntityDiscount.find({ provider: providerId });
    res.status(200).json({ success: true, message: "تم حفظ خصومات الجهات الخاصة", data: updated });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const simulateDiscount = async (req, res) => {
  try {
    const providerId = req.user._id;
    const qty = Number(req.query.qty);
    if (!qty || qty < 1) return res.status(400).json({ success: false, message: "qty مطلوب وأكبر من 0" });

    const tiers = await DiscountTier.find({ provider: providerId, is_active: true }).sort({ discount: -1 });
    let appliedTier = null;
    for (const tier of tiers) {
      if (qty >= tier.minQty && (tier.maxQty === null || qty <= tier.maxQty)) { appliedTier = tier; break; }
    }
    res.status(200).json({ success: true, data: { qty, tierName: appliedTier?.name || "Standard", discountPct: appliedTier?.discount || 0, appliedTier } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

module.exports = { getDiscountTiers, createDiscountTier, updateDiscountTier, toggleDiscountTier, deleteDiscountTier, getSpecialEntities, updateSpecialEntity, saveAllSpecialEntities, simulateDiscount };