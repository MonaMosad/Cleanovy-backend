

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
      type: String,
      
      required: function () {
        // الحقل ده هيكون إجباري فقط لو نوع التوصيل delivery
        return this.delivery_type === 'delivery';
      }
    },

    delivery_type: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
      default: "delivery",
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
      type: String,
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