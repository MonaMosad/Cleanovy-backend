// models/delivery.model.js
import mongoose from "mongoose";

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

export default mongoose.model("Delivery", deliverySchema);