// models/laundryShop.model.js
  // import mongoose from "mongoose";
const mongoose = require("mongoose");

const laundryShopSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    name: { type: String, required: true },
    description: { type: String },


    // هل الـ provider موقوف بسبب عمولات غير مسددة؟
     is_suspended: {
    type: Boolean,
    default: false,
  },
  
    // سبب الإيقاف (بيتحدث أوتوماتيك لما يتعمل settlement)

  suspension_reason: {
    type: String,
    default: null,
  },

    address: { type: String },

    lat: Number,
    lng: Number,

    is_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
  
);

// export default mongoose.model("LaundryShop", laundryShopSchema);
module.exports = mongoose.model("LaundryShop", laundryShopSchema);
