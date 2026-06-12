// models/region.model.js
const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },

    // ✅ ADDED: useful for geo-filtering laundry shops
    city: { type: String, trim: true },
  },
  { timestamps: true }
);

const Region = mongoose.model("Region", regionSchema);
module.exports = Region;
