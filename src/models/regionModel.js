// models/region.model.js
import mongoose from "mongoose";

const regionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },

    // ✅ ADDED: useful for geo-filtering laundry shops
    city: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Region", regionSchema);
