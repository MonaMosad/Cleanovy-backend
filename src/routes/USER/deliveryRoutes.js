// routes/deliveryRoutes.js
import { Router } from "express";
import { getDeliveries, createDelivery, updateDeliveryStatus } from "../controllers/deliveryController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/",              requireRole("provider"), getDeliveries);
router.post("/",             requireRole("provider"), createDelivery);
router.patch("/:id/status",  requireRole("provider", "admin"), updateDeliveryStatus);
export default router;
