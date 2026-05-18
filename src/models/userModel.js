// models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    username: { type: String, unique: true, sparse: true, trim: true },

    email: { type: String, unique: true, required: true, lowercase: true, trim: true },

    password: { type: String, required: true },

    phone: { type: String, trim: true },

    national_id: { type: String, trim: true },

    avatar: { type: String, default: null }, // URL to profile image

    role: {
      type: String,
      enum: ["client", "provider", "admin"],
      default: "client",
    },

    // ✅ ADDED: needed for email verification flow (Dev 1)
    is_verified: { type: Boolean, default: false },

    // ✅ ADDED: soft-delete / ban support (Admin panel)
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
