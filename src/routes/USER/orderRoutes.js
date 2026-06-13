// routes/orderRoutes.js
import { Router } from "express";
import {
  createOrder, getOrders, getOrderById,
  updateOrderStatus, getOrderItems,
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.post("/",                    createOrder);
router.get("/",                     getOrders);
router.get("/:id",                  getOrderById);
router.get("/:id/items",            getOrderItems);
router.patch("/:id/status",         updateOrderStatus);

export default router;
