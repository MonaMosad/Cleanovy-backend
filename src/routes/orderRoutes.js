const express = require("express");
const {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getOrderItems,
  getOrders,
} = require("../controllers/orderController.js");

// const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

// router.use(protect);

router.post("/",              createOrder);
router.get("/",               getOrders);
router.get("/:id",            getOrderById);
router.get("/:id/items",      getOrderItems);
router.patch("/:id/status",   updateOrderStatus);

module.exports = router;