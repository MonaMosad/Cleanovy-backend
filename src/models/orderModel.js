// models/order.model.js
import mongoose from "mongoose";

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

    provider_price: { type: Number, default: 0 },
    app_price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    shipping_price: { type: Number, default: 0 },

    total_price: { type: Number, default: 0 },

    pickup_time: { type: Date, required: true },
    delivery_time: { type: Date },

    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);