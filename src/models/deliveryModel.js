// models/delivery.model.js
const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    // ✅ FIX: added required order reference — delivery must be tied to an order
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true, // one delivery record per order
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaundryShop",
      required: true,
    },

    // Delivery person info (can be provider's own staff)
    name: { type: String, trim: true },
    phone: { type: String, trim: true },

    status: {
      type: String,
      enum: ["assigned", "picked_up", "delivered"],
      default: "assigned",
    },

    // ✅ ADDED: timestamps for each delivery milestone
    picked_up_at: { type: Date, default: null },
    delivered_at: { type: Date, default: null },
  },
  { timestamps: true }
);


const Delivery = mongoose.model("Delivery", deliverySchema);
module.exports = Delivery;
