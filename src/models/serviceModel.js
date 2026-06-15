



// models/service.model.js
// import mongoose from "mongoose";
const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    description: { type: String, default: "" },

    icon: { type: String, default: "" }, // icon key chosen in step 1

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null, // null = this IS a category
    },

    // null = admin/basic (visible to all), has value = created by that provider only
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaundryShop",
      default: null,
    },

    // ✅ ADDED: image/icon for the service card in UI
    image: { type: String, default: null },


    // ✅ ADDED: active flag to hide/show services without deleting
    duration_hours: { type: Number, default: 24 }, // e.g. 6, 12, 24, 48, 72

    unit: {
      type: String,
      enum: ["per_piece", "per_kg", "per_meter", "per_set"],
      default: "per_piece",
    },

    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// export default mongoose.model("Service", serviceSchema);
module.exports = mongoose.model("Service", serviceSchema);
