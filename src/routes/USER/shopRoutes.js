// routes/shopRoutes.js
const { Router } = require("express");
const {
  getShops, getShopById, createShop, updateShop,
  getShopServices, addShopService, removeShopService,
  getShopReviews, getMyShop, getShopDashboard,
} = require("../../controllers/USER/shopController.js");
const { protect, restrictTo } = require("../../middleware/authMiddleware.js");

const router = Router();

// Provider (static paths first so they are not captured by "/:id")
router.get(   "/provider/my",           protect, restrictTo("provider"), getMyShop);

// Public
router.get("/",    getShops);
router.get("/:id/services", getShopServices);
router.get("/:id/reviews",  getShopReviews);
router.get("/:id/dashboard",            protect, restrictTo("provider", "admin"), getShopDashboard);
router.get("/:id", getShopById);

// Provider (mutations)
router.post(  "/",                       protect, restrictTo("provider"), createShop);
router.put(   "/:id",                    protect, restrictTo("provider"), updateShop);
router.post(  "/:id/services",           protect, restrictTo("provider"), addShopService);
router.delete("/:id/services/:psId",     protect, restrictTo("provider"), removeShopService);

module.exports = router;
