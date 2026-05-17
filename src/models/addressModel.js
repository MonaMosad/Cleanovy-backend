// models/address.model.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    region: { type: mongoose.Schema.Types.ObjectId, ref: "Region" },

    address: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Address", addressSchema);