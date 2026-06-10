

// models/order.model.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaundryShop",
      required: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "in_progress",
        "ready",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    cancel_reason: { type: String }, // ← added: set when provider rejects an order

    provider_price: { type: Number, default: 0 },
    app_price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    shipping_price: { type: Number, default: 0 },
    total_price: { type: Number, default: 0 },

    pickup_time: { type: Date, required: true },
    delivery: { type: mongoose.Schema.Types.ObjectId, ref: "Delivery" },
    delivery_time: { type: Date },

    notes: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;