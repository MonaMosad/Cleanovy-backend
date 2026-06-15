// // // // models/order.model.js
// // // // import mongoose from "mongoose";
// // // // require("mongoose")from "mongoose";
// // // const mongoose = require("mongoose");
// // // const orderSchema = new mongoose.Schema(
// // //   { 
// // //     provider: {
// // //       type: mongoose.Schema.Types.ObjectId,
// // //       ref: "LaundryShop",
// // //       required: true,
// // //     },

// // //     client: {
// // //       type: mongoose.Schema.Types.ObjectId,
// // //       ref: "User",
// // //       required: true,
// // //     },

// // //     status: {
// // //       type: String,
// // //       enum: [
// // //         "pending",
// // //         "accepted",
// // //         "picked_up",
// // //         "in_progress",
// // //         "ready",
// // //         "out_for_delivery",
// // //         "delivered",
// // //         "cancelled",
// // //       ],
// // //       default: "pending",
// // //     },

// // //     provider_price: { type: Number, default: 0 },
// // //     app_price: { type: Number, default: 0 },
// // //     discount: { type: Number, default: 0 },
// // //     shipping_price: { type: Number, default: 0 },
// // //     app_commission: { type: Number,default: 0},

// // //     total_price: { type: Number, default: 0 },

// // //     pickup_time: { type: Date, required: true },
// // //     delivery_time: { type: Date },

// // //     notes: { type: String },
// // //   },
// // //   { timestamps: true }
// // // );

// // // // export default mongoose.model("Order", orderSchema);
// // // module.exports = mongoose.model("Order", orderSchema);

// // // src/models/orderModel.js
// // // models/order.model.js
// // const mongoose = require("mongoose");

// // const orderSchema = new mongoose.Schema(
// //   {
// //     client: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "User",
// //       required: true,
// //     },

// // <<<<<<< HEAD
// //     provider: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "LaundryShop",
// //       required: true,
// //     },

// //     // ── Pricing ──────────────────────────────────────────────
// //     // سعر الخدمات من الـ provider
// //     provider_price: {
// //       type: Number,
// //       required: true,
// //       min: 0,
// //     },

// //     // رسوم الشحن
// //     shipping_price: {
// //       type: Number,
// //       default: 0,
// //       min: 0,
// //     },

// //     // الخصم من الكوبون
// //     discount: {
// //       type: Number,
// //       default: 0,
// //       min: 0,
// //     },

// //     // الكوبون المستخدم (اختياري)
// //     coupon: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "Coupon",
// //       default: null,
// //     },

// //     // السعر النهائي اللي العميل بيدفعه
// //     // = provider_price + shipping_price - discount
// //     total_price: {
// //       type: Number,
// //       required: true,
// //       min: 0,
// //     },

// //     // عمولة الموقع (10% من provider_price)
// //     // بتتحسب في حالة الدفع بالبطاقة/Vodafone Cash فقط
// //     platform_commission: {
// //       type: Number,
// //       default: 0,
// //     },

// //     // ── Payment ───────────────────────────────────────────────
// //     payment_method: {
// //       type: String,
// //       enum: ["card", "vodafone_cash", "cash"],
// //       required: true,
// //     },

// //     payment_status: {
// //       type: String,
// //       enum: ["pending", "paid", "failed", "refunded"],
// //       default: "pending",
// //     },

// //     // Reference من بوابة الدفع الوهمية
// //     payment_reference: {
// //       type: String,
// //       default: null,
// //     },

// //     // ── Status ────────────────────────────────────────────────
// //     status: {
// //       type: String,
// //       enum: [
// //         "pending",
// //         "accepted",
// //         "picked_up",
// //         "in_progress",
// //         "ready",
// //         "out_for_delivery",
// //         "delivered",
// //         "cancelled",
// //       ],
// //       default: "pending",
// // =======
// //     address: {
// //         type: mongoose.Schema.Types.ObjectId,
// //         ref: "Address",
// //         required: true,
// // >>>>>>> origin/main
// //     },
// //     delivery_type: {
// //   type: String,
// //   enum: ["pickup", "delivery"],
// //   required: true,
// //   default: "delivery",
// // },

// // <<<<<<< HEAD
// // delivery_address: {
// //   type: String,
// //   default: null,
// // },
// // =======
// //    status: {
// //   type: String,
// //   enum: [
// //     "pending",
// //     "accepted",
// //     "in_progress",
// //     "ready",
// //     "out_for_delivery",
// //     "delivered",
// //     "cancelled"
// //   ],
// //     default: "pending",
// //    },

// //     provider_price: { type: Number, default: 0 },
// //     app_price: { type: Number, default: 0 },
// //     discount: { type: Number, default: 0 },
// //     shipping_price: { type: Number, default: 0 },
// // >>>>>>> origin/main

// //     // ── Schedule ──────────────────────────────────────────────
// //     pickup_time: {
// //       type: Date,
// //       required: true,
// //     },

// // <<<<<<< HEAD
// //     delivery_time: {
// //       type: Date,
// //       default: null,
// //     },
// // =======
// //     pickup_time: { type: Date, required: true },
// //     delivery : {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "Delivery",
// //     },
// //     delivery_time: { type: Date },
// // >>>>>>> origin/main

// //     notes: {
// //       type: String,
// //       default: null,
// //       maxlength: 500,
// //     },
// //   },
// //   { timestamps: true }
// // );

// // <<<<<<< HEAD
// // orderSchema.index({ client: 1, status: 1 });
// // orderSchema.index({ provider: 1, status: 1 });
// // orderSchema.index({ provider: 1, payment_method: 1, status: 1 });

// // module.exports = mongoose.model("Order", orderSchema);

// // =======

// //  const Order = mongoose.model("Order", orderSchema);
// //  module.exports = Order;
// // >>>>>>> origin/main
// // models/order.model.js
// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//   {
//     client: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

// <<<<<<< HEAD
//     // ✅ ADDED: the client's delivery address for this specific order
// =======
//     provider: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "LaundryShop",
//       required: true,
//     },

//     // ── Address & Fulfillment ─────────────────────────────────
// >>>>>>> main
//     address: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Address",
//       required: true,
//     },

// <<<<<<< HEAD
//     // ✅ ADDED: link to delivery person/record once assigned
// =======
//     delivery_type: {
//       type: String,
//       enum: ["pickup", "delivery"],
//       required: true,
//       default: "delivery",
//     },

// >>>>>>> main
//     delivery: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Delivery",
//       default: null,
//     },

// <<<<<<< HEAD
// =======
//     // ── Pricing ──────────────────────────────────────────────
//     provider_price: {
//       type: Number,
//       required: true,
//       min: 0,
//       default: 0,
//     },

//     shipping_price: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     discount: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     coupon: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Coupon",
//       default: null,
//     },

//     total_price: {
//       type: Number,
//       required: true,
//       min: 0,
//       default: 0,
//     },

//     platform_commission: {
//       type: Number,
//       default: 0,
//     },

//     // ── Payment ───────────────────────────────────────────────
//     payment_method: {
//       type: String,
//       enum: ["card", "vodafone_cash", "cash"],
//       required: true,
//     },

//     payment_status: {
//       type: String,
//       enum: ["pending", "paid", "failed", "refunded"],
//       default: "pending",
//     },

//     payment_reference: {
//       type: String,
//       default: null,
//     },

//     // ── Status ────────────────────────────────────────────────
// >>>>>>> main
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

// <<<<<<< HEAD
//     // Price breakdown
//     provider_price: { type: Number, default: 0 },   // sum of items before fees
//     app_price: { type: Number, default: 0 },         // platform commission/service fee
//     discount: { type: Number, default: 0 },
//     shipping_price: { type: Number, default: 0 },
//     total_price: { type: Number, default: 0 },       // final = provider_price + app_price + shipping - discount

//     pickup_time: { type: Date, required: true },
//     delivery_time: { type: Date },

//     notes: { type: String, trim: true },

//     // ✅ ADDED: cancellation reason (required when status = cancelled)
//     cancel_reason: { type: String, trim: true, default: null },
// =======
//     // ── Schedule ──────────────────────────────────────────────
//     pickup_time: {
//       type: Date,
//       required: true,
//     },

//     delivery_time: {
//       type: Date,
//       default: null,
//     },

//     notes: {
//       type: String,
//       default: null,
//       maxlength: 500,
//     },
// >>>>>>> main
//   },
//   { timestamps: true }
// );

// <<<<<<< HEAD
// export default mongoose.model("Order", orderSchema);
// =======
// // ── Indexes ──────────────────────────────────────────────────
// orderSchema.index({ client: 1, status: 1 });
// orderSchema.index({ provider: 1, status: 1 });
// orderSchema.index({ provider: 1, payment_method: 1, status: 1 });

// const Order = mongoose.model("Order", orderSchema);
// module.exports = Order;
// >>>>>>> main
// models/order.model.js
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

    // ── Address & Fulfillment ─────────────────────────────────
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      default: null,
    },

    delivery_type: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
      default: "delivery",
    },

    // عنوان التوصيل كنص حر (للطلبات التي لا تستخدم Address collection)
    delivery_address: {
      type: String,
      default: null,
      maxlength: 500,
    },

    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
      default: null,
    },

    // ── Pricing ──────────────────────────────────────────────
    provider_price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    shipping_price: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    total_price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

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

    // ✅ ADDED: cancellation reason
    cancel_reason: { type: String, trim: true, default: null },

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

// ── Indexes ──────────────────────────────────────────────────
orderSchema.index({ client: 1, status: 1 });
orderSchema.index({ provider: 1, status: 1 });
orderSchema.index({ provider: 1, payment_method: 1, status: 1 });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;