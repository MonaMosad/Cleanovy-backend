const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  getStats,
} = require("../controllers/Profilecontroller");

const {
  validateUpdateProfile,
} = require("../middleware/validationMiddleware");

// ─── Multer config (avatar upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user._id}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("نوع الملف غير مدعوم. يرجى رفع صورة JPG أو PNG أو WebP"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ─── All routes require auth
router.use(protect);

router.get("/me", getProfile);
router.get("/stats", getStats);
router.patch("/update", validateUpdateProfile, updateProfile);
router.patch("/avatar", upload.single("avatar"), uploadAvatar);
router.delete("/avatar", deleteAvatar);

module.exports = router;