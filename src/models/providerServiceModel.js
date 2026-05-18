// models/providerService.model.js
import mongoose from "mongoose";

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

    price: { type: Number, required: true, min: 0 },

    // ✅ ADDED: allows override of the global service unit at provider level
    unit: {
      type: String,
      enum: ["per_piece", "per_kg", "per_set"],
      default: "per_piece",
    },

    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ ADDED: compound unique index — a provider can't list the same service twice
providerServiceSchema.index({ provider: 1, service: 1 }, { unique: true });

export default mongoose.model("ProviderService", providerServiceSchema);
