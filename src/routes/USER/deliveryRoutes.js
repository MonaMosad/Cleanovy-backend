// routes/deliveryRoutes.js
const { Router } = require("express");
const { getDeliveries, createDelivery, updateDeliveryStatus } = require("../../controllers/USER/deliveryController.js");
const { protect, restrictToProvider, restrictTo } = require("../../middleware/authMiddleware.js");

const router = Router();
router.use(protect);
router.get("/",              restrictToProvider, getDeliveries);
router.post("/",             restrictToProvider, createDelivery);
router.patch("/:id/status",  restrictTo("provider", "laundry_owner", "admin"), updateDeliveryStatus);
module.exports = router;
