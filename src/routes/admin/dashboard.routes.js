const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/admin/dashboard.controller");

router.get("/stats", dashboardController.getStats);
router.get("/financial", dashboardController.getFinancial);
router.get("/recent-orders", dashboardController.getRecentOrders);
router.get("/pending-laundries", dashboardController.getPendingLaundries);
router.patch("/pending-laundries/:id/approve", dashboardController.approveLaundry);
router.delete("/pending-laundries/:id/reject", dashboardController.rejectLaundry);
module.exports = router;
