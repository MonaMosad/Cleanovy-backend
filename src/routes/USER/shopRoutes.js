// routes/shopRoutes.js
const { Router } = require("express");
const {
  getShops, getShopById, createShop, updateShop,
  getShopServices, addShopService, removeShopService,
  getShopReviews, getMyShop, getShopDashboard,
} = require("../../controllers/USER/shopController.js");
const { protect, restrictToProvider } = require("../../middleware/authMiddleware.js");

const router = Router();

// Provider (static paths first so they are not captured by "/:id")
router.get(   "/provider/my",           protect, restrictToProvider, getMyShop);

// Public
router.get("/",    getShops);
router.get("/:id/services", getShopServices);
router.get("/:id/reviews",  getShopReviews);
router.get("/:id/dashboard",            protect, restrictToProvider, getShopDashboard);
router.get("/:id", getShopById);

// Provider (mutations)
router.post(  "/",                       protect, restrictToProvider, createShop);
router.put(   "/:id",                    protect, restrictToProvider, updateShop);
router.post(  "/:id/services",           protect, restrictToProvider, addShopService);
router.delete("/:id/services/:psId",     protect, restrictToProvider, removeShopService);

module.exports = router;
