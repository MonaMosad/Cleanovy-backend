// models/laundryShop.model.js
import mongoose from "mongoose";

const workingHoursSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"],
      required: true,
    },
    open: { type: String }, // e.g. "09:00"
    close: { type: String }, // e.g. "22:00"
    is_closed: { type: Boolean, default: false },
  },
  { _id: false }
);

const laundryShopSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // ✅ ADDED: region reference for filtering/search by area
    region: { type: mongoose.Schema.Types.ObjectId, ref: "Region" },

    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    // Human-readable address string
    address: { type: String, trim: true },

    lat: { type: Number },
    lng: { type: Number },

    // ✅ ADDED: contact info for the shop
    phone: { type: String, trim: true },

    // ✅ ADDED: shop images/gallery
    images: [{ type: String }], // array of image URLs

    // ✅ ADDED: logo / cover photo
    logo: { type: String, default: null },

    // ✅ ADDED: working hours per day
    working_hours: [workingHoursSchema],

    // ✅ ADDED: avg_rating computed and stored for fast queries
    avg_rating: { type: Number, default: 0, min: 0, max: 5 },
    total_reviews: { type: Number, default: 0 },

    is_verified: { type: Boolean, default: false },

    // ✅ ADDED: soft-delete / suspend shop
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("LaundryShop", laundryShopSchema);
