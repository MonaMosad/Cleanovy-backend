// models/review.model.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaundryShop",
      required: true,
    },

    // ✅ KEPT: tying review to an order ensures one review per order (see index below)
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: { type: String, trim: true },

    // ✅ ADDED: provider reply to the review (used in Dev 5 — Provider Reviews Management)
    provider_reply: {
      type: String,
      trim: true,
      default: null,
    },

    provider_replied_at: { type: Date, default: null },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
