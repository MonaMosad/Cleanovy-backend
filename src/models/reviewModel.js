const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaundryShop",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true, // كل أوردر ماله غير ريفيو واحد
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, default: null },
    provider_reply: { type: String, trim: true, default: null },
    provider_replied_at: { type: Date, default: null },

    // ✅ ADDED: الأدمن يقدر يخفي ريفيو مسيء
    is_hidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ provider: 1, createdAt: -1 });
reviewSchema.index({ client: 1 });

module.exports = mongoose.model("Review", reviewSchema);