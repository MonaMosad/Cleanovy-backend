const express = require("express");
const router  = express.Router();
const ctrl    = require("../../controllers/admin/reviews.controller");

router.get("/",                ctrl.getReviews);        // لستة + فلاتر
router.patch("/:id/toggle-hide", ctrl.toggleHideReview); // إخفاء/إظهار
router.delete("/:id",          ctrl.deleteReview);      // حذف نهائي

module.exports = router;
