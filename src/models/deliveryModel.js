// models/delivery.model.js
const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaundryShop",
    },

    name: String,
    phone: String,

    status: {
      type: String,
      enum: ["assigned", "picked_up", "delivered"],
      default: "assigned",
    },
  },
  { timestamps: true }
);

const Delivery = mongoose.model("Delivery", deliverySchema);
module.exports = Delivery;