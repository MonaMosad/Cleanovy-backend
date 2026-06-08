// models/service.model.js
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

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;