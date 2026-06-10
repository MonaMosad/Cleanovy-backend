// src/controllers/payment.controller.js
const Order = require("../models/orderModel.js");
const Commission = require("../models/commissionModel.js");
const CommissionSettlement = require("../models/commissionSettlementModel.js");
const AppError = require("../utils/AppError.js");
const catchAsync = require("../utils/catchAsync.js");
const mongoose = require("mongoose");

const COMMISSION_RATE = 0.1;         // 10% عمولة الموقع
const CASH_ORDERS_THRESHOLD = 5;     // كل 5 أوردرات نقدي → settlement

// ══════════════════════════════════════════════════════════════
//  Helper: بوابة الدفع الوهمية
//  بترجع success أو failure بناءً على بيانات الكارت
// ══════════════════════════════════════════════════════════════
const fakePay = ({ payment_method, card_number, phone_number, amount }) => {
  // Simulate failure: أي كارت ينتهي بـ 0000 بيفشل
  if (payment_method === "card" && card_number?.endsWith("0000")) {
    return { success: false, reason: "بيانات البطاقة غير صحيحة" };
  }
  // Simulate failure: رقم موبايل أقل من 11 رقم
  if (payment_method === "vodafone_cash" && phone_number?.length !== 11) {
    return { success: false, reason: "رقم الموبايل غير صحيح" };
  }

  // نجاح — بنولد reference وهمي
  const reference = `PAY-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  return { success: true, reference };
};

// ══════════════════════════════════════════════════════════════
//  Helper: بعد ما الأوردر يتسلم (delivered) في حالة cash
//  بنسجل commission وبنشوف لو وصلنا 5 أوردرات → settlement
// ══════════════════════════════════════════════════════════════
const handleCashCommission = async (order) => {
  // سجل العمولة على الأوردر ده
  const commissionAmount =
    Math.round(order.provider_price * COMMISSION_RATE * 100) / 100;

  const commission = await Commission.create({
    provider: order.provider,
    order: order._id,
    order_amount: order.provider_price,
    commission_rate: COMMISSION_RATE,
    commission_amount: commissionAmount,
    status: "pending",
  });

  // احسب عدد الـ pending commissions للـ provider ده
  const pendingCommissions = await Commission.find({
    provider: order.provider,
    status: "pending",
    settlement_id: null,
  });

  // لو وصلنا 5 → اعمل settlement
  if (pendingCommissions.length >= CASH_ORDERS_THRESHOLD) {
    const totalCommission = pendingCommissions.reduce(
      (sum, c) => sum + c.commission_amount,
      0
    );

    const settlement = await CommissionSettlement.create({
      provider: order.provider,
      commissions: pendingCommissions.map((c) => c._id),
      total_commission: Math.round(totalCommission * 100) / 100,
      status: "unpaid",
    });

    // اربط الـ commissions بالـ settlement
    await Commission.updateMany(
      { _id: { $in: pendingCommissions.map((c) => c._id) } },
      { settlement_id: settlement._id }
    );

    // وقف خدمة الـ provider (is_suspended = true)
    // ملاحظة: لازم يكون فيه حقل is_suspended في model الـ LaundryShop
    const LaundryShop = require("../models/laundryShopModel.js");
    await LaundryShop.findByIdAndUpdate(order.provider, {
      is_suspended: true,
      suspension_reason: `يوجد settlement غير مدفوع: ${settlement._id}`,
    });

    return { commission, settlement, suspended: true };
  }

  return { commission, settlement: null, suspended: false };
};

// ══════════════════════════════════════════════════════════════
// 1. دفع أوردر (Client)
//    POST /api/payments/pay/:orderId
// ══════════════════════════════════════════════════════════════
const payOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const clientId = req.user?._id ?? req.body.client_id;

  const { payment_method, card_number, card_expiry, card_cvv, phone_number } =
    req.body;

  if (!["card", "vodafone_cash", "cash"].includes(payment_method))
    return next(new AppError("طريقة الدفع غير صحيحة", 400));

  const order = await Order.findById(orderId);
  if (!order) return next(new AppError("الطلب غير موجود", 404));

  // if (order.client.toString() !== clientId.toString())
  //   return next(new AppError("غير مصرح لك بدفع هذا الطلب", 403));

  if (order.payment_status === "paid")
    return next(new AppError("هذا الطلب مدفوع بالفعل", 400));

  if (!["pending", "accepted"].includes(order.status))
    return next(new AppError("لا يمكن الدفع في هذه المرحلة", 400));

  // ── نقدي ──────────────────────────────────────────────────
  if (payment_method === "cash") {
    const commissionAmount =
      Math.round(order.provider_price * COMMISSION_RATE * 100) / 100;

    order.payment_method      = "cash";
    order.payment_status      = "pending";
    order.platform_commission = commissionAmount;
    await order.save();

    // سجل العمولة كـ pending
    await Commission.create({
      provider:          order.provider,
      order:             order._id,
      order_amount:      order.provider_price,
      commission_rate:   COMMISSION_RATE,
      commission_amount: commissionAmount,
      status:            "pending",
    });

    // شوف لو وصلنا 5 → اعمل settlement
    const pendingCommissions = await Commission.find({
      provider:      order.provider,
      status:        "pending",
      settlement_id: null,
    });

    if (pendingCommissions.length >= CASH_ORDERS_THRESHOLD) {
      const totalCommission = pendingCommissions.reduce(
        (sum, c) => sum + c.commission_amount, 0
      );

      const settlement = await CommissionSettlement.create({
        provider:         order.provider,
        commissions:      pendingCommissions.map(c => c._id),
        total_commission: Math.round(totalCommission * 100) / 100,
        status:           "unpaid",
      });

      await Commission.updateMany(
        { _id: { $in: pendingCommissions.map(c => c._id) } },
        { $set: { settlement_id: settlement._id } }
      );

      const LaundryShop = require("../models/laundryShopModel.js");
      await LaundryShop.findByIdAndUpdate(order.provider, {
        is_suspended:      true,
        suspension_reason: `يوجد settlement غير مدفوع: ${settlement._id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "تم تأكيد طريقة الدفع نقداً عند الاستلام",
      data: {
        order_id:            order._id,
        payment_status:      "pending",
        platform_commission: commissionAmount,
        provider_receives:   Math.round((order.provider_price - commissionAmount) * 100) / 100,
      },
    });
  }

  // ── بطاقة أو Vodafone Cash: بوابة الدفع الوهمية ──────────
  if (payment_method === "card") {
    if (!card_number || !card_expiry || !card_cvv)
      return next(new AppError("بيانات البطاقة ناقصة", 400));
  }
  if (payment_method === "vodafone_cash") {
    if (!phone_number)
      return next(new AppError("رقم الموبايل مطلوب", 400));
  }

  const gatewayResult = fakePay({
    payment_method,
    card_number,
    phone_number,
    amount: order.total_price,
  });

  if (!gatewayResult.success) {
    order.payment_status = "failed";
    await order.save();
    return next(new AppError(`فشل الدفع: ${gatewayResult.reason}`, 402));
  }

  // ── خصم عمولة الموقع تلقائياً (10% من provider_price) ────
  const commissionAmount =
    Math.round(order.provider_price * COMMISSION_RATE * 100) / 100;

  // المبلغ اللي الـ provider هياخده = total_price - commission
  // (بس ده بس للتسجيل، مفيش تحويل حقيقي)
  order.payment_method = payment_method;
  order.payment_status = "paid";
  order.payment_reference = gatewayResult.reference;
  order.platform_commission = commissionAmount;
  await order.save();

  // سجل العمولة كـ "paid" مباشرة (لأن الـ platform قبض)
  await Commission.create({
    provider: order.provider,
    order: order._id,
    order_amount: order.provider_price,
    commission_rate: COMMISSION_RATE,
    commission_amount: commissionAmount,
    status: "paid",
  });

  res.status(200).json({
    success: true,
    message: "تم الدفع بنجاح",
    data: {
      order_id: order._id,
      payment_reference: gatewayResult.reference,
      payment_method,
      total_paid: order.total_price,
      platform_commission: commissionAmount,
      provider_receives: Math.round((order.total_price - commissionAmount) * 100) / 100,
    },
  });
});

// ══════════════════════════════════════════════════════════════
// 2. لما الأوردر يوصل "delivered" → نعالج العمولة النقدية
//    هذه الدالة تُستدعى من داخل updateOrderStatus
//    مش endpoint مستقل
// ══════════════════════════════════════════════════════════════
const onOrderDelivered = async (order) => {
  if (order.payment_method !== "cash") return;
  if (order.payment_status === "paid") return;

  // سجل الدفع النقدي كـ paid (العميل دفع للـ provider)
  order.payment_status = "paid";
  await order.save();

  // اعمل commission record وشوف لو محتاج settlement
  await handleCashCommission(order);
};

// ══════════════════════════════════════════════════════════════
// 3. Provider يدفع الـ settlement المتراكم
//    POST /api/payments/settlement/:settlementId/pay
// ══════════════════════════════════════════════════════════════
const paySettlement = catchAsync(async (req, res, next) => {
  const providerId = req.user?._id ?? req.body.provider_id;
  const { settlementId } = req.params;
  const { payment_method, card_number, card_expiry, card_cvv, phone_number } =
    req.body;

  if (!["card", "vodafone_cash"].includes(payment_method))
    return next(
      new AppError("طريقة الدفع يجب أن تكون card أو vodafone_cash", 400)
    );

  const settlement = await CommissionSettlement.findOne({
    _id: settlementId,
    provider: providerId,
    status: "unpaid",
  }).populate("commissions");

  if (!settlement)
    return next(
      new AppError("الـ settlement غير موجود أو تم دفعه بالفعل", 404)
    );

  // بوابة الدفع الوهمية
  const gatewayResult = fakePay({
    payment_method,
    card_number,
    phone_number,
    amount: settlement.total_commission,
  });

  if (!gatewayResult.success) {
    return next(new AppError(`فشل الدفع: ${gatewayResult.reason}`, 402));
  }

  // حدّث الـ settlement
  settlement.status = "paid";
  settlement.payment_method = payment_method;
  settlement.payment_reference = gatewayResult.reference;
  settlement.paid_at = new Date();
  await settlement.save();

  // حدّث الـ commissions
  await Commission.updateMany(
    { _id: { $in: settlement.commissions.map((c) => c._id) } },
    { $set: { status: "paid" } }
  );

  // فك إيقاف الـ provider
  const LaundryShop = require("../models/laundryShopModel.js");
  const unpaidSettlements = await CommissionSettlement.countDocuments({
    provider: providerId,
    status: "unpaid",
  });

  if (unpaidSettlements === 0) {
    await LaundryShop.findByIdAndUpdate(providerId, {
      is_suspended: false,
      suspension_reason: null,
    });
  }

  res.status(200).json({
    success: true,
    message: "تم دفع العمولة بنجاح وتم إعادة تفعيل الخدمة",
    data: {
      settlement_id: settlement._id,
      total_paid: settlement.total_commission,
      payment_reference: gatewayResult.reference,
      provider_reactivated: unpaidSettlements === 0,
    },
  });
});

// ══════════════════════════════════════════════════════════════
// 4. Provider يشوف الـ settlements بتاعته
//    GET /api/payments/settlements/my
// ══════════════════════════════════════════════════════════════
const getMySettlements = catchAsync(async (req, res, next) => {
  const providerId = req.user?._id ?? req.query.provider_id;

  const settlements = await CommissionSettlement.find({
    provider: providerId,
  })
    .populate("commissions")
    .sort({ createdAt: -1 });

  const summary = {
    total_unpaid: settlements
      .filter((s) => s.status === "unpaid")
      .reduce((sum, s) => sum + s.total_commission, 0),
    total_paid: settlements
      .filter((s) => s.status === "paid")
      .reduce((sum, s) => sum + s.total_commission, 0),
  };

  res.status(200).json({
    success: true,
    data: {
      summary,
      count: settlements.length,
      settlements,
    },
  });
});

// ══════════════════════════════════════════════════════════════
// 5. Admin يشوف كل الـ settlements
//    GET /api/payments/settlements/admin/all
// ══════════════════════════════════════════════════════════════
const getAllSettlementsAdmin = catchAsync(async (req, res, next) => {
  const page  = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const skip  = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [settlements, total] = await Promise.all([
    CommissionSettlement.find(filter)
      .populate("provider", "name")
      .populate("commissions")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    CommissionSettlement.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      total,
      page,
      pages: Math.ceil(total / limit),
      settlements,
    },
  });
});

module.exports = {
  payOrder,
  onOrderDelivered,
  paySettlement,
  getMySettlements,
  getAllSettlementsAdmin,
};
