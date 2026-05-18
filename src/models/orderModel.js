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

    // ✅ ADDED: the client's delivery address for this specific order
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    // ✅ ADDED: link to delivery person/record once assigned
    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
      default: null,
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

    // Price breakdown
    provider_price: { type: Number, default: 0 },   // sum of items before fees
    app_price: { type: Number, default: 0 },         // platform commission/service fee
    discount: { type: Number, default: 0 },
    shipping_price: { type: Number, default: 0 },
    total_price: { type: Number, default: 0 },       // final = provider_price + app_price + shipping - discount

    pickup_time: { type: Date, required: true },
    delivery_time: { type: Date },

    notes: { type: String, trim: true },

    // ✅ ADDED: cancellation reason (required when status = cancelled)
    cancel_reason: { type: String, trim: true, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
