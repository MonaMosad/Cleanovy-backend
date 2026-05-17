// models/review.model.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaundryShop",
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    comment: String,

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);