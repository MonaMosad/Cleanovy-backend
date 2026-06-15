// src/routes/paymentRoutes.js
const express = require("express");
const {
  payOrder,
  paySettlement,
  getMySettlements,
  getAllSettlementsAdmin,
} = require("../controllers/paymentController.js");

// const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

// router.use(protect);

// POST  /api/payments/pay/:orderId
router.post("/pay/:orderId", payOrder);

// POST  /api/payments/settlement/:settlementId/pay
router.post("/settlement/:settlementId/pay", paySettlement);

// GET   /api/payments/settlements/my
router.get("/settlements/my", getMySettlements);

// GET   /api/payments/settlements/admin/all
router.get("/settlements/admin/all", getAllSettlementsAdmin);

module.exports = router;