const mongoose = require("mongoose");

const guestReviewSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaundryShop",
      required: true,
    },
    rating:         { type: Number, required: true, min: 1, max: 5 },
    comment:        { type: String, trim: true, required: true },
    clientName:     { type: String, default: "زائر" },
    provider_reply: { type: String, trim: true, default: null },
    is_hidden:      { type: Boolean, default: false },
  },
  { timestamps: true, collection: "guest_reviews" }
);

guestReviewSchema.index({ provider: 1, createdAt: -1 });

module.exports = mongoose.model("GuestReview", guestReviewSchema);
