// models/discountTier.model.js
const mongoose = require("mongoose");

const discountTierSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaundryShop",
      required: true,
    },
    name: { type: String, required: true }, // e.g. "Bronze", "Gold"
    minQty: { type: Number, required: true },
    maxQty: { type: Number, default: null }, // null = no upper limit
    discount: { type: Number, required: true, min: 0, max: 100 }, // percentage
    color: { type: String, default: "bg-slate-300" }, // Tailwind class for UI
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const DiscountTier = mongoose.model("DiscountTier", discountTierSchema);
module.exports = DiscountTier;
