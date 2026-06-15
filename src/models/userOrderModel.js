const mongoose = require("mongoose");

const UserOrderItemSchema = new mongoose.Schema({
  providerService: { type: mongoose.Schema.Types.ObjectId, ref: "ProviderService" },
  serviceName:     { type: String },
  price:           { type: Number },
  quantity:        { type: Number, default: 1 },
  fast:            { type: Boolean, default: false },
  lineTotal:       { type: Number },
}, { _id: false });

const userOrderSchema = new mongoose.Schema({
  shop:          { type: mongoose.Schema.Types.ObjectId, ref: "LaundryShop", required: true },
  orderNumber:   { type: String },
  customerName:  { type: String },
  phone:         { type: String },
  address:       { type: String },
  notes:         { type: String },
  items:         [UserOrderItemSchema],
  subtotal:      { type: Number, default: 0 },
  discountRate:  { type: Number, default: 0 },
  discount:      { type: Number, default: 0 },
  vat:           { type: Number, default: 0 },
  deliveryFee:   { type: Number, default: 0 },
  total_price:   { type: Number, default: 0 },
  currency:      { type: String, default: "EGP" },
  paymentMethod: { type: String, enum: ["cash", "card", "wallet"], default: "cash" },
  status: {
    type: String,
    enum: ["pending", "confirmed", "in_progress", "ready", "delivered", "cancelled"],
    default: "pending",
  },
}, { timestamps: true, collection: "user_orders" });

userOrderSchema.pre("save", function (next) {
  if (!this.orderNumber) this.orderNumber = `CLN-${Date.now()}`;
  next();
});

module.exports = mongoose.model("UserOrder", userOrderSchema);
