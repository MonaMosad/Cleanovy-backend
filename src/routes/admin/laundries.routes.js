const express = require("express");
const router  = express.Router();
const ctrl    = require("../../controllers/admin/laundries.controller");


router.get("/pending",           ctrl.getPendingLaundries);  // قيد الموافقة
router.patch("/:id/approve",     ctrl.approveLaundry);       // قبول
router.delete("/:id/reject",     ctrl.rejectLaundry);        // رفض

router.get("/",                  ctrl.getLaundries);          // لستة المعتمدة
router.get("/:id",               ctrl.getLaundryById);        // تفاصيل مغسلة
router.patch("/:id/suspend",     ctrl.suspendLaundry);        // إيقاف
router.patch("/:id/restore",     ctrl.restoreLaundry);        // إعادة تفعيل

module.exports = router;