// models/user.model.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fullName: { type: String },
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

const User = mongoose.model("User", userSchema);
module.exports = User;

