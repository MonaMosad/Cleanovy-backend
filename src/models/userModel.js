// models/user.model.js
// import mongoose from "mongoose";
require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    phone: { type: String },
    national_id: { type: String },

    role: {
      type: String,
      enum: ["client", "provider", "admin"],
      default: "client",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);