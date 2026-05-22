// models/providerService.model.js
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

    price: { type: Number, required: true },

    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ProviderService = mongoose.model("ProviderService", providerServiceSchema);
module.exports = ProviderService;