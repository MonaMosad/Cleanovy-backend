// // routes/provider/reviewsRoutes.js

// // TODO: uncomment middleware once auth is active
// // router.use(authMiddleware);
// // router.use(providerOnlyMiddleware);

// const express = require("express");
// const router = express.Router();
// const reviewsController = require("../../controllers/provider/reviewsController");

// // ⚠ ORDER MATTERS — specific routes must come before /:id-style routes

// // ── Reviews ──────────────────────────────────────────────────────
// // GET  /provider/reviews              — all reviews for this provider (+ stats)
// // POST /provider/reviews              — create a review (customer action — temp here for testing)
// // POST /provider/reviews/:id/reply    — provider replies to a review
// router.get("/", reviewsController.getReviews);
// router.post("/", reviewsController.createReview);
// router.post("/:id/reply", reviewsController.replyToReview);

// module.exports = router;




const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const providerOnlyMiddleware = require("../../middleware/providerOnlyMiddleware");
const reviewsController = require("../../controllers/provider/reviewsController");

router.use(protect);
router.use(providerOnlyMiddleware);

router.get("/", reviewsController.getReviews);
router.post("/", reviewsController.createReview);
router.post("/:id/reply", reviewsController.replyToReview);

module.exports = router;