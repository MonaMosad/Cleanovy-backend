


const mongoose = require("mongoose");



const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  body: { type: String },
  type: { type: String },
  is_read: { type: Boolean, default: false },
}, { timestamps: true });