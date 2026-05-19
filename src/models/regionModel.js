// models/region.model.js
  // import mongoose from "mongoose";
require("mongoose");
const regionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Region", regionSchema);