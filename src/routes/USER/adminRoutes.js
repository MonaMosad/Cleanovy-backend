// routes/adminRoutes.js
const { Router } = require("express");
const { getAllUsers, getAllShops, verifyShop, getPlatformStats } = require("../../controllers/USER/adminController.js");
const { protect, restrictTo } = require("../../middleware/authMiddleware.js");

const router = Router();
router.use(protect, restrictTo("admin"));
router.get("/users",           getAllUsers);
router.get("/shops",           getAllShops);
router.patch("/shops/:id/verify", verifyShop);
router.get("/stats",           getPlatformStats);
module.exports = router;
