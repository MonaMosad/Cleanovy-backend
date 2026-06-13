// routes/deliveryRoutes.js
const { Router } = require("express");
const { getDeliveries, createDelivery, updateDeliveryStatus } = require("../../controllers/USER/deliveryController.js");
const { protect, restrictTo } = require("../../middleware/authMiddleware.js");

const router = Router();
router.use(protect);
router.get("/",              restrictTo("provider"), getDeliveries);
router.post("/",             restrictTo("provider"), createDelivery);
router.patch("/:id/status",  restrictTo("provider", "admin"), updateDeliveryStatus);
module.exports = router;
