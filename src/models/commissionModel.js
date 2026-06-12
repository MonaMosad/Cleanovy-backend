// src/models/commissionModel.js
const mongoose = require("mongoose");

// ══════════════════════════════════════════════════════════════
//  Commission — عمولة الموقع على كل أوردر نقدي
//  بيتحسب كل 5 أوردرات delivered، لو ما دفعش بيتوقف الـ provider
// ══════════════════════════════════════════════════════════════

const commissionSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaundryShop",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true, // كل أوردر ليه commission record واحد بس
    },

    // المبلغ الأصلي للأوردر
    order_amount: {
      type: Number,
      required: true,
    },

    // نسبة العمولة (10% افتراضي)
    commission_rate: {
      type: Number,
      default: 0.1,
    },

    // مبلغ العمولة = order_amount * commission_rate
    commission_amount: {
      type: Number,
      required: true,
    },

    // حالة العمولة
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    // رقم الـ settlement (كل 5 أوردرات بيتجمعوا في settlement واحد)
    settlement_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommissionSettlement",
      default: null,
    },
  },
  { timestamps: true }
);

commissionSchema.index({ provider: 1, status: 1 });

module.exports = mongoose.model("Commission", commissionSchema);
