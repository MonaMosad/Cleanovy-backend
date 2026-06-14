const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code:         { type: String, required: true, unique: true, uppercase: true, trim: true },
    provider:     { type: mongoose.Schema.Types.ObjectId, ref: "LaundryShop", required: true },
    discount_type: { type: String, enum: ["percentage", "fixed"], required: true },
    discount_value: { type: Number, required: true, min: 0 },
    max_discount_amount: { type: Number, default: null },
    min_order_amount:    { type: Number, default: 0 },
    max_uses:            { type: Number, default: null },
    used_count:          { type: Number, default: 0 },
    used_by:             [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    single_use_per_client: { type: Boolean, default: false },
    is_active:   { type: Boolean, default: true },
    expires_at:  { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);