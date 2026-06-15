const express = require("express");
const router  = express.Router();
const ctrl    = require("../../controllers/admin/orders.controller");

router.get("/",    ctrl.getOrders);      // لستة + فلاتر + عدّادات
router.get("/:id", ctrl.getOrderById);   // تفاصيل أوردر (read-only)

module.exports = router;