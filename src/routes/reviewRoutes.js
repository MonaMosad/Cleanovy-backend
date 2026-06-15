const express = require("express");
const router = express.Router();
const {
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

router.post("/", addReview);
router.patch("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
