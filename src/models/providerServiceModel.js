// models/providerService.model.js
<<<<<<< HEAD
  // import mongoose from "mongoose";
// require("mongoose");
const mongoose = require("mongoose");
=======
const mongoose = require("mongoose");

>>>>>>> origin/main
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

<<<<<<< HEAD
// export default mongoose.model("ProviderService", providerServiceSchema);
module.exports = mongoose.model("ProviderService", providerServiceSchema);
=======
const ProviderService = mongoose.model("ProviderService", providerServiceSchema);
module.exports = ProviderService;
>>>>>>> origin/main
