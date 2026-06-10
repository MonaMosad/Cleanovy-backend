// models/orderItem.model.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    // ✅ FIX: made required — an item cannot exist without an order
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    quantity: { type: Number, default: 1, min: 1 },

    unit_price: { type: Number, required: true, min: 0 },

    total_price: { type: Number, required: true, min: 0 }, // quantity * unit_price
  },
  { timestamps: true,collection: "orderItems" }
);

// export default mongoose.model("OrderItem", orderItemSchema);
module.exports = mongoose.model("OrderItem", orderItemSchema);
