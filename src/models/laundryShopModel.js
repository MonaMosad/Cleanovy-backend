// models/laundryShop.model.js
const mongoose = require("mongoose");

const laundryShopSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    name: { type: String, required: true },
    description: { type: String },

    address: { type: String },

    lat: Number,
    lng: Number,

    is_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const LaundryShop = mongoose.model("LaundryShop", laundryShopSchema);
module.exports = LaundryShop;