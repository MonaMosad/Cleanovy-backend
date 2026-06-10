


// routes/provider/ordersRoutes.js

// TODO: uncomment middleware once auth is active
// router.use(authMiddleware);
// router.use(providerOnlyMiddleware);

const express = require("express");
const router = express.Router();
const ordersController = require("../../controllers/provider/ordersController");

// ⚠ ORDER MATTERS — specific routes must come before /:id

router.get("/", ordersController.getOrders);
router.get("/report/today", ordersController.getTodayReport); // ← before /:id
router.get("/:id", ordersController.getOrderById);
router.post("/:orderId/accept", ordersController.acceptOrder);
router.post("/:orderId/reject", ordersController.rejectOrder);
router.patch("/:orderId/status", ordersController.updateOrderStatus);

module.exports = router;