// controllers/reviewController.js
// const Review = require("../../models/reviewModel.js");
const Review = require("../../models/reviewModel.js");
const Order = require("../../models/orderModel.js");

// POST /api/reviews  (Client reviews a completed order)
const createReview = async (req, res) => {
  try {
    const { order: orderId, rating, comment } = req.body;
    if (!orderId || !rating)
      return res.status(400).json({ message: "order and rating required" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.client.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not your order" });

    if (order.status !== "delivered")
      return res.status(400).json({ message: "Can only review delivered orders" });

    const existing = await Review.findOne({ order: orderId, client: req.user._id });
    if (existing) return res.status(409).json({ message: "Already reviewed this order" });

    const review = await Review.create({
      provider: order.provider,
      order: orderId,
      client: req.user._id,
      rating: Math.min(5, Math.max(1, parseInt(rating))),
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reviews/shop/:shopId
const getShopReviews = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      sort_by = "newest",   // ← newest | rating_high | rating_low
    } = req.query;

    // ── Sort options ──────────────────────────────
    let sortStage = {};

    if (sort_by === "rating_high") {
      sortStage = { rating: -1 };       // الأعلى تقييماً أولاً
    } else if (sort_by === "rating_low") {
      sortStage = { rating: 1 };        // الأقل تقييماً أولاً
    } else {
      sortStage = { createdAt: -1 };    // الأحدث أولاً (default)
    }

    const reviews = await Review.find({ provider: req.params.shopId })
      .populate("client", "name")
      .sort(sortStage)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ provider: req.params.shopId });

    res.json({ total, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/reviews/:id  (Admin only)
const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createReview, getShopReviews, deleteReview };
