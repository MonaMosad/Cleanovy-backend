// routes/provider/settingsRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const providerOnlyMiddleware = require("../../middleware/providerOnlyMiddleware");
const settingsController = require("../../controllers/provider/settingsController");

router.use(authMiddleware);
router.use(providerOnlyMiddleware);

// GET  /provider/settings  → جيب الإعدادات الحالية
// PATCH /provider/settings → احفظ الإعدادات
router.get("/", settingsController.getSettings);
router.patch("/", settingsController.updateSettings);

module.exports = router;