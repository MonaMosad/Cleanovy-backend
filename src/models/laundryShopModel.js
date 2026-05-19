// models/laundryShop.model.js
  // import mongoose from "mongoose";
require("mongoose");
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

export default mongoose.model("LaundryShop", laundryShopSchema);