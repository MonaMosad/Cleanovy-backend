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




// // models/laundryShop.model.js
// const mongoose = require("mongoose");

// const laundryShopSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

//     name: { type: String, required: true },
//     description: { type: String },
//     address: { type: String },
//     lat: Number,
//     lng: Number,
//     is_verified: { type: Boolean, default: false },

//     // ── Settings page fields ──────────────────────────
//     role: { type: String, default: "مدير العمليات" },   // job title shown in profile
//     open_time: { type: String, default: "08:00" },
//     close_time: { type: String, default: "22:00" },
//     accept_orders: { type: Boolean, default: true },
//     fast_service_default: { type: Boolean, default: true },
//     order_alerts: { type: Boolean, default: true },
//     email_notifications: { type: Boolean, default: true },
//     sms_notifications: { type: Boolean, default: false },
//     language: { type: String, enum: ["ar", "en"], default: "ar" },
//   },
//   { timestamps: true }
// );

// const LaundryShop = mongoose.model("LaundryShop", laundryShopSchema);
// module.exports = LaundryShop;