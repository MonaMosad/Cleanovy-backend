// models/specialEntityDiscount.model.js
const mongoose = require("mongoose");

const specialEntityDiscountSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaundryShop",
      required: true,
    },
    entityKey: { type: String, required: true }, // e.g. "mosque", "school", "hospital"
    label: { type: String, required: true },      // e.g. "المساجد"
    icon: { type: String, required: true },       // material icon name
    sub: { type: String },                        // subtitle
    discount: { type: Number, required: true, min: 0, max: 100 }, // percentage
    is_enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Prevent duplicate entityKey per provider
specialEntityDiscountSchema.index({ provider: 1, entityKey: 1 }, { unique: true });

const SpecialEntityDiscount = mongoose.model("SpecialEntityDiscount", specialEntityDiscountSchema);
module.exports = SpecialEntityDiscount;