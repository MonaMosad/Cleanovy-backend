const express = require("express");
const router = express.Router();
const {
  getReviews,
  toggleHideReview,
  deleteReview,
} = require("../../controllers/admin/reviews.controller");

// GET  /api/admin/reviews
router.get("/", getReviews);

// PATCH /api/admin/reviews/:id/toggle-hide
router.patch("/:id/toggle-hide", toggleHideReview);

// DELETE /api/admin/reviews/:id
router.delete("/:id", deleteReview);

module.exports = router;
