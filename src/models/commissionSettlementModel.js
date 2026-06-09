// src/models/commissionSettlementModel.js
const mongoose = require("mongoose");

// ══════════════════════════════════════════════════════════════
//  CommissionSettlement
//  كل 5 أوردرات نقدي delivered → settlement واحد
//  لو ما دفعش → provider يتوقف
// ══════════════════════════════════════════════════════════════

const settlementSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LaundryShop",
      required: true,
    },

    // الـ 5 commissions اللي داخلين في الـ settlement ده
    commissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Commission",
      },
    ],

    // المبلغ الإجمالي للـ settlement
    total_commission: {
      type: Number,
      required: true,
    },

    // حالة الـ settlement
    status: {
      type: String,
      enum: ["unpaid", "paid", "overdue"],
      default: "unpaid",
    },

    // معلومات الدفع لما الـ provider يدفع
    payment_method: {
      type: String,
      enum: ["card", "vodafone_cash", null],
      default: null,
    },

    payment_reference: {
      type: String,
      default: null,
    },

    paid_at: {
      type: Date,
      default: null,
    },

    // Deadline للدفع (اختياري — ممكن تضيف deadline بعدين)
    due_date: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

settlementSchema.index({ provider: 1, status: 1 });

module.exports = mongoose.model("CommissionSettlement", settlementSchema);
