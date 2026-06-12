// routes/adminRoutes.js
import { Router } from "express";
import { getAllUsers, getAllShops, verifyShop, getPlatformStats } from "../controllers/adminController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(protect, requireRole("admin"));
router.get("/users",           getAllUsers);
router.get("/shops",           getAllShops);
router.patch("/shops/:id/verify", verifyShop);
router.get("/stats",           getPlatformStats);
export default router;
