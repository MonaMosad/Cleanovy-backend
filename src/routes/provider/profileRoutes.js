// routes/provider/profileRoutes.js
const express = require("express");
const router = express.Router();
// const authMiddleware = require("../../middleware/authMiddleware");
// const providerOnlyMiddleware = require("../../middleware/providerOnlyMiddleware");
const profileController = require("../../controllers/provider/profileController");

// router.use(authMiddleware);
// router.use(providerOnlyMiddleware);

// GET  /provider/profile   → جيب بيانات الملف الشخصي
// PATCH /provider/profile  → حفظ التعديلات
router.get("/", profileController.getProfile);
router.patch("/", profileController.updateProfile);

module.exports = router;