// models/address.model.js
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    // ✅ FIX: made required — an address must belong to a user
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    region: { type: mongoose.Schema.Types.ObjectId, ref: "Region", required: true },

    address: { type: String, required: true, trim: true },

    // ✅ ADDED: optional label for the address (e.g. "Home", "Work")
    label: { type: String, trim: true, default: "Home" },

    // ✅ ADDED: optional geo coordinates for map display / delivery
    lat: { type: Number },
    lng: { type: Number },

    // ✅ ADDED: allow users to mark a default address
    is_default: { type: Boolean, default: false },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Address", addressSchema);
