const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "LaundryShop", required: true, index: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // denormalized for fast reads
    customerName: { type: String, trim: true, default: "عميل" },
    avatar: { type: String, default: null },
    orderCode: { type: String, trim: true, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000, default: "" },
    is_hidden: { type: Boolean, default: false },
    // provider reply
    reply: { type: String, trim: true, maxlength: 1000, default: null },
    repliedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
reviewSchema.index({ order: 1 }, { unique: true });
reviewSchema.index({ provider: 1, createdAt: -1 });
module.exports = mongoose.model("Review", reviewSchema);