// models/service.model.js
// import mongoose from "mongoose";
const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    // ✅ KEPT: self-referencing parent for category/subcategory tree
    // null = top-level category (e.g. "Washing"), ObjectId = subcategory (e.g. "Shirt")
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },

    // ✅ ADDED: image/icon for the service card in UI
    image: { type: String, default: null },

    // ✅ ADDED: unit helps providers price correctly (e.g. "per piece", "per kg")
    unit: {
      type: String,
      enum: ["per_piece", "per_kg", "per_set"],
      default: "per_piece",
    },

    // ✅ ADDED: active flag to hide/show services without deleting
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// export default mongoose.model("Service", serviceSchema);
module.exports = mongoose.model("Service", serviceSchema);
