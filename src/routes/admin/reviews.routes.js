const express = require("express");
const router = express.Router();
const { getReviewsCount } = require("../../controllers/reviewController");

router.get("/count", getReviewsCount);

module.exports = router;
