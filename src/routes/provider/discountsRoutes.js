



// // routes/provider/discountsRoutes.js

// // في كل route file
// // router.use(authMiddleware);        // التحقق من التوكن
// // router.use(providerOnlyMiddleware); // التحقق إنه provider مش client

// const express = require("express");
// const router = express.Router();
// const discountsController = require("../../controllers/provider/discountsController");

// // ── Discount Tiers ──────────────────────────────────────────────────
// // GET  /provider/discounts/tiers         — كل المستويات
// // POST /provider/discounts/tiers         — إضافة مستوى جديد
// router.get("/tiers", discountsController.getDiscountTiers);
// router.post("/tiers", discountsController.createDiscountTier);

// // PATCH  /provider/discounts/tiers/:id          — تعديل مستوى
// // PATCH  /provider/discounts/tiers/:id/toggle   — تفعيل / إيقاف
// // DELETE /provider/discounts/tiers/:id          — حذف مستوى
// router.patch("/tiers/:id", discountsController.updateDiscountTier);
// router.patch("/tiers/:id/toggle", discountsController.toggleDiscountTier);
// router.delete("/tiers/:id", discountsController.deleteDiscountTier);

// // ── Special Entity Discounts ────────────────────────────────────────
// // GET  /provider/discounts/special-entities            — كل الجهات
// // PATCH /provider/discounts/special-entities/:id       — تعديل جهة واحدة
// // POST /provider/discounts/special-entities/save-all  — حفظ الكل دفعة واحدة
// router.get("/special-entities", discountsController.getSpecialEntities);
// router.patch("/special-entities/:id", discountsController.updateSpecialEntity);
// router.post("/special-entities/save-all", discountsController.saveAllSpecialEntities);

// // ── Simulator ───────────────────────────────────────────────────────
// // GET /provider/discounts/simulate?qty=35
// router.get("/simulate", discountsController.simulateDiscount);

// module.exports = router;






const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const providerOnlyMiddleware = require("../../middleware/providerOnlyMiddleware");
const discountsController = require("../../controllers/provider/discountsController");

router.use(protect);
router.use(providerOnlyMiddleware);

router.get("/tiers", discountsController.getDiscountTiers);
router.post("/tiers", discountsController.createDiscountTier);
router.patch("/tiers/:id", discountsController.updateDiscountTier);
router.patch("/tiers/:id/toggle", discountsController.toggleDiscountTier);
router.delete("/tiers/:id", discountsController.deleteDiscountTier);

router.get("/special-entities", discountsController.getSpecialEntities);
router.patch("/special-entities/:id", discountsController.updateSpecialEntity);
router.post("/special-entities/save-all", discountsController.saveAllSpecialEntities);

router.get("/simulate", discountsController.simulateDiscount);

module.exports = router;