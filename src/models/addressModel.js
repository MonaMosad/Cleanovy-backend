// models/address.model.js
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    region: { type: mongoose.Schema.Types.ObjectId, ref: "Region" },

    address: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);