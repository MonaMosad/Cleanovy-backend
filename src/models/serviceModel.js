// models/service.model.js
// import mongoose from "mongoose";
const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },
  },
  { timestamps: true }
);

// export default mongoose.model("Service", serviceSchema);
module.exports = mongoose.model("Service", serviceSchema);