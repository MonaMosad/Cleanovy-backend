// models/laundryShop.model.js
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
//   },
//   { timestamps: true }
// );

// const LaundryShop = mongoose.model("LaundryShop", laundryShopSchema);
// module.exports = LaundryShop;




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






// models/laundryShop.model.js
const mongoose = require("mongoose");

const workingHoursSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"],
      required: true,
    },
    open: { type: String },
    close: { type: String },
    is_closed: { type: Boolean, default: false },
  },
  { _id: false }
);
// import mongoose from "mongoose";

// const laundryShopSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

//     name: { type: String, required: true },
//     description: { type: String },

//     address: { type: String },

//     lat: Number,
//     lng: Number,

//     is_verified: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("LaundryShop", laundryShopSchema);


const laundryShopSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    region: { type: mongoose.Schema.Types.ObjectId, ref: "Region" },

    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    is_suspended: { type: Boolean, default: false },
    suspension_reason: { type: String, default: null },

    address: { type: String, trim: true },
    lat: { type: Number },
    lng: { type: Number },

    phone: { type: String, trim: true },
    images: [{ type: String }],
    logo: { type: String, default: null },

    working_hours: [workingHoursSchema],

    avg_rating: { type: Number, default: 0, min: 0, max: 5 },
    total_reviews: { type: Number, default: 0 },

    is_verified: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },

    // ── Settings fields ──────────────────────────────────────
    role: { type: String, default: "مدير العمليات" },
    open_time: { type: String, default: "08:00" },
    close_time: { type: String, default: "22:00" },
    accept_orders: { type: Boolean, default: true },
    fast_service_default: { type: Boolean, default: true },
    order_alerts: { type: Boolean, default: true },
    email_notifications: { type: Boolean, default: true },
    sms_notifications: { type: Boolean, default: false },
    language: { type: String, enum: ["ar", "en"], default: "ar" },
    max_daily_orders: { type: Number, default: 20 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LaundryShop", laundryShopSchema);