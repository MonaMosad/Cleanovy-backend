// routes/shopRoutes.js
import { Router } from "express";
import {
  getShops, getShopById, createShop, updateShop,
  getShopServices, addShopService, removeShopService,
  getShopReviews, getMyShop, getShopDashboard,
} from "../controllers/shopController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

// Public
router.get("/",    getShops);
router.get("/:id", getShopById);
router.get("/:id/services", getShopServices);
router.get("/:id/reviews",  getShopReviews);

// Provider
router.get(   "/provider/my",           protect, requireRole("provider"), getMyShop);
router.post(  "/",                       protect, requireRole("provider"), createShop);
router.put(   "/:id",                    protect, requireRole("provider"), updateShop);
router.get(   "/:id/dashboard",          protect, requireRole("provider", "admin"), getShopDashboard);
router.post(  "/:id/services",           protect, requireRole("provider"), addShopService);
router.delete("/:id/services/:psId",     protect, requireRole("provider"), removeShopService);

export default router;
