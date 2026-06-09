// // models/order.model.js
// // import mongoose from "mongoose";
// // require("mongoose")from "mongoose";
// const mongoose = require("mongoose");
// const orderSchema = new mongoose.Schema(
//   { 
//     provider: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "LaundryShop",
//       required: true,
//     },

//     client: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: [
//         "pending",
//         "accepted",
//         "picked_up",
//         "in_progress",
//         "ready",
//         "out_for_delivery",
//         "delivered",
//         "cancelled",
//       ],
//       default: "pending",
//     },

//     provider_price: { type: Number, default: 0 },
//     app_price: { type: Number, default: 0 },
//     discount: { type: Number, default: 0 },
//     shipping_price: { type: Number, default: 0 },
//     app_commission: { type: Number,default: 0},

//     total_price: { type: Number, default: 0 },

//     pickup_time: { type: Date, required: true },
//     delivery_time: { type: Date },

//     notes: { type: String },
//   },
//   { timestamps: true }
// );

// // export default mongoose.model("Order", orderSchema);
// module.exports = mongoose.model("Order", orderSchema);

// src/models/orderModel.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaundryShop",
      required: true,
    },

    // ── Pricing ──────────────────────────────────────────────
    // سعر الخدمات من الـ provider
    provider_price: {
      type: Number,
      required: true,
      min: 0,
    },

    // رسوم الشحن
    shipping_price: {
      type: Number,
      default: 0,
      min: 0,
    },

    // الخصم من الكوبون
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // الكوبون المستخدم (اختياري)
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    // السعر النهائي اللي العميل بيدفعه
    // = provider_price + shipping_price - discount
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },

    // عمولة الموقع (10% من provider_price)
    // بتتحسب في حالة الدفع بالبطاقة/Vodafone Cash فقط
    platform_commission: {
      type: Number,
      default: 0,
    },

    // ── Payment ───────────────────────────────────────────────
    payment_method: {
      type: String,
      enum: ["card", "vodafone_cash", "cash"],
      required: true,
    },

    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    // Reference من بوابة الدفع الوهمية
    payment_reference: {
      type: String,
      default: null,
    },

    // ── Status ────────────────────────────────────────────────
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "picked_up",
        "in_progress",
        "ready",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    delivery_type: {
  type: String,
  enum: ["pickup", "delivery"],
  required: true,
  default: "delivery",
},

delivery_address: {
  type: String,
  default: null,
},

    // ── Schedule ──────────────────────────────────────────────
    pickup_time: {
      type: Date,
      required: true,
    },

    delivery_time: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: null,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

orderSchema.index({ client: 1, status: 1 });
orderSchema.index({ provider: 1, status: 1 });
orderSchema.index({ provider: 1, payment_method: 1, status: 1 });

module.exports = mongoose.model("Order", orderSchema);

