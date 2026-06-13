// routes/reviewRoutes.js
const { Router } = require("express");
const { createReview, getShopReviews, deleteReview } = require("../../controllers/USER/reviewController.js");
const { protect, restrictTo } = require("../../middleware/authMiddleware.js");

const router = Router();
router.get("/shop/:shopId",  getShopReviews);
router.post("/",             protect, restrictTo("client"), createReview);
router.delete("/:id",        protect, restrictTo("admin"),  deleteReview);
module.exports = router;
