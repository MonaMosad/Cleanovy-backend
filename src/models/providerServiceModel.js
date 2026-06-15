// models/providerService.model.js
  // import mongoose from "mongoose";
// require("mongoose");
const mongoose = require("mongoose");
const providerServiceSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaundryShop",
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    price: { type: Number, required: true, min: 0 },

    // ✅ ADDED: allows override of the global service unit at provider level
    unit: {
      type: String,
      enum: ["per_piece", "per_kg", "per_set"],
      default: "per_piece",
    },

    is_active: { type: Boolean, default: true },

    // ── Fast service support ──────────────────────────────────
    fast_service:    { type: Boolean, default: false },
    fast_multiplier: { type: Number,  default: 1 },
    name:            { type: String,  default: null },   // optional name override
    category:        { type: String,  default: null },   // optional category override
  },
  { timestamps: true }
);

// export default mongoose.model("ProviderService", providerServiceSchema);
module.exports = mongoose.model("ProviderService", providerServiceSchema);
