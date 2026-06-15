// routes/orderRoutes.js
const { Router } = require("express");
const {
  createOrder, getOrders, getOrderById,
  updateOrderStatus, getOrderItems,
} = require("../../controllers/USER/orderController.js");
const { protect } = require("../../middleware/authMiddleware.js");

const router = Router();
router.use(protect);

router.post("/",                    createOrder);
router.get("/",                     getOrders);
router.get("/:id",                  getOrderById);
router.get("/:id/items",            getOrderItems);
router.patch("/:id/status",         updateOrderStatus);

module.exports = router;
