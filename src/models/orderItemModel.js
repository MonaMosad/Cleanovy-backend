// models/orderItem.model.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProviderService",
      required: true,
    },

    quantity: { type: Number, default: 1 },

    unit_price: { type: Number, required: true },

    total_price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("OrderItem", orderItemSchema);