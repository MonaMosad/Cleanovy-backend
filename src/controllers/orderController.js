// src/controllers/orderController.js
const mongoose = require("mongoose");
const Order = require("../models/orderModel.js");
const OrderItem = require("../models/orderItemModel.js");
const LaundryShop = require("../models/laundryShopModel.js");
const ProviderService = require("../models/providerServiceModel.js");
const Coupon = require("../models/couponModel.js");
const AppError = require("../utils/AppError.js");
const catchAsync = require("../utils/catchAsync.js");
const { onOrderDelivered } = require("./paymentController.js");

const COMMISSION_RATE = 0.1;

// ─── مصفوفة تدفق الحالات الصارمة ──────────────────────────────────────────────
const STATUS_FLOW = {
  pending:          ["accepted", "cancelled"],
  accepted:         ["picked_up", "cancelled"],
  picked_up:        ["in_progress"],
  in_progress:      ["ready"],
  ready:            ["out_for_delivery"],
  out_for_delivery: ["delivered"],
  delivered:        [],
  cancelled:        [],
};

// ─── دالة مساعدة لحساب خصم الكوبون ───────────────────────────────────────────
const calcCouponDiscount = (coupon, baseAmount) => {
  if (!coupon) return 0;
  let disc = 0;
  if (coupon.discount_type === "percentage") {
    disc = (baseAmount * coupon.discount_value) / 100;
    if (coupon.max_discount_amount !== null) {
      disc = Math.min(disc, coupon.max_discount_amount);
    }
  } else {
    disc = Math.min(coupon.discount_value, baseAmount);
  }
  return Math.round(disc * 100) / 100;
};

// ══════════════════════════════════════════════════════════════
// 1. إنشاء طلب جديد — POST /api/orders
// ══════════════════════════════════════════════════════════════
const createOrder = catchAsync(async (req, res, next) => {
  console.log("REQ BODY:", JSON.stringify(req.body, null, 2));
  const {
    provider,
    items,
    pickup_time,
    delivery_time,
    shipping_price = 0,
    notes,
    coupon_code,
    payment_method,
    delivery_type = "delivery",
    address,
  } = req.body;

  if (!["card", "vodafone_cash", "cash"].includes(payment_method))
    return next(new AppError("طريقة الدفع غير صحيحة", 400));

  if (!["pickup", "delivery"].includes(delivery_type))
    return next(new AppError("نوع التسليم غير صحيح", 400));

  if (delivery_type === "delivery" && !address?.trim())
    return next(new AppError("عنوان التوصيل مطلوب عند اختيار التوصيل للبيت", 400));

  if (!mongoose.Types.ObjectId.isValid(provider))
    return next(new AppError("provider_id غير صالح", 400));

  if (!items?.length)
    return next(new AppError("items لا يمكن أن تكون فارغة", 400));

  const providerDoc = await LaundryShop.findById(provider).lean();
  if (!providerDoc || !providerDoc.is_verified)
    return next(new AppError("المغسلة غير موجودة أو غير موثقة", 404));

  if (providerDoc.is_suspended)
    return next(new AppError("المغسلة موقوفة مؤقتاً بسبب عمولات غير مسددة", 403));

  const normalizedItems = items.map((item) => ({
    serviceId: item.providerService_id || item.provider_service_id,
    quantity: Math.max(parseInt(item.quantity) || 1, 1),
  }));

  const serviceIds = normalizedItems.map((i) => i.serviceId);

  if (!serviceIds.every((id) => mongoose.Types.ObjectId.isValid(id)))
    return next(new AppError("service id غير صالح", 400));

  const pickup = new Date(pickup_time);
  if (isNaN(pickup)) return next(new AppError("pickup_time غير صالح", 400));
  if (pickup <= new Date()) return next(new AppError("موعد الاستلام يجب أن يكون في المستقبل", 400));

  const delivery = delivery_time ? new Date(delivery_time) : null;
  if (delivery && (isNaN(delivery) || delivery <= pickup))
    return next(new AppError("delivery_time غير صالح", 400));

  const dbServices = await ProviderService.find({
    _id: { $in: serviceIds },
    provider: new mongoose.Types.ObjectId(provider),
    is_active: true,
  }).lean();

  if (dbServices.length !== serviceIds.length)
    return next(new AppError("بعض الخدمات غير موجودة أو غير نشطة", 400));

  const priceMap = new Map(dbServices.map((s) => [s._id.toString(), Number(s.price)]));

  let provider_price = 0;
  const orderItemsData = normalizedItems.map((item) => {
    const unit_price = priceMap.get(item.serviceId);
    if (unit_price == null) throw new AppError("Service price not found", 400);
    const total_price = unit_price * item.quantity;
    provider_price += total_price;
    return { service: item.serviceId, quantity: item.quantity, unit_price, total_price };
  });

  const shipping = delivery_type === "pickup" ? 0 : Number(shipping_price) || 20;

  // ── Coupon Logic ──────────────────────────────────────────
  let couponDoc = null;
  let discount = 0;
  let couponId = null;
  const clientId = req.user?._id;

  if (!clientId) return next(new AppError("يجب تسجيل الدخول لإتمام الطلب", 401));

  if (coupon_code) {
    couponDoc = await Coupon.findOne({
      code: coupon_code.toUpperCase().trim(),
      provider,
      is_active: true,
    });

    if (!couponDoc)
      return next(new AppError("الكوبون غير موجود أو غير صالح لهذا المزود", 400));
    if (couponDoc.expires_at && couponDoc.expires_at < new Date())
      return next(new AppError("انتهت صلاحية الكوبون", 400));
    if (couponDoc.max_uses !== null && couponDoc.used_count >= couponDoc.max_uses)
      return next(new AppError("تم استنفاد عدد مرات استخدام هذا الكوبون", 400));
    if (couponDoc.single_use_per_client && couponDoc.used_by.includes(clientId))
      return next(new AppError("لقد استخدمت هذا الكوبون من قبل", 400));
    if (provider_price < couponDoc.min_order_amount)
      return next(new AppError(`الحد الأدنى لقيمة الطلب هو ${couponDoc.min_order_amount}`, 400));

    discount = calcCouponDiscount(couponDoc, provider_price);
    couponId = couponDoc._id;
  }

  const platform_commission = payment_method !== "cash"
    ? Math.round(provider_price * COMMISSION_RATE * 100) / 100
    : 0;

  const total_price = Math.max(
    Math.round((provider_price + shipping - discount) * 100) / 100,
    0
  );

  const order = await Order.create({
    client: clientId,
    provider,
    pickup_time: pickup,
    delivery_time: delivery,
    provider_price,
    shipping_price: shipping,
    discount,
    coupon: couponId,
    total_price,
    platform_commission,
    payment_method,
    payment_status: "pending",
    notes,
    status: "pending",
    delivery_type,
    address: delivery_type === "delivery" ? address.trim() : null,
  });

  await OrderItem.insertMany(orderItemsData.map((i) => ({ ...i, order: order._id })));

  if (couponDoc) {
    await Coupon.findByIdAndUpdate(couponDoc._id, {
      $inc: { used_count: 1 },
      $push: { used_by: clientId },
    });
  }

  res.status(201).json({
    success: true,
    message: "تم إنشاء الطلب بنجاح",
    data: { order },
  });
});

// ══════════════════════════════════════════════════════════════
// 2. تفاصيل طلب — GET /api/orders/:id
// ══════════════════════════════════════════════════════════════
const getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("client", "fullName email phone")
    .populate("provider", "name address lat lng")
    .populate("coupon", "code discount_type discount_value")
    .lean();

  if (!order) return next(new AppError("الطلب غير موجود", 404));

  const items = await OrderItem.find({ order: order._id })
    .populate({ path: "service", populate: { path: "service", select: "name" } })
    .lean();

  res.status(200).json({ success: true, data: { order: { ...order, items } } });
});

// ══════════════════════════════════════════════════════════════
// 3. تحديث حالة الطلب — PATCH /api/orders/:id/status
// ══════════════════════════════════════════════════════════════
const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  if (!status) return next(new AppError("الحالة الجديدة مطلوبة", 400));

  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("الطلب غير موجود", 404));

  const allowedNext = STATUS_FLOW[order.status] ?? [];
  if (!allowedNext.includes(status))
    return next(new AppError(
      `لا يمكن الانتقال من "${order.status}" إلى "${status}". المسموح: [${allowedNext.join(", ") || "لا يوجد"}]`,
      400
    ));

  order.status = status;
  await order.save();

  if (status === "delivered") await onOrderDelivered(order);

  res.status(200).json({ success: true, message: `تم تحديث الحالة إلى "${status}"`, data: { order } });
});

// ══════════════════════════════════════════════════════════════
// 4. تعديل المواعيد — PATCH /api/orders/:id/schedule
// ══════════════════════════════════════════════════════════════
const updateSchedule = catchAsync(async (req, res, next) => {
  const { pickup_time, delivery_time } = req.body;

  if (!pickup_time && !delivery_time)
    return next(new AppError("أرسل pickup_time أو delivery_time على الأقل", 400));

  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("الطلب غير موجود", 404));

  if (!["pending", "accepted"].includes(order.status))
    return next(new AppError(`لا يمكن تعديل المواعيد في حالة "${order.status}"`, 400));

  if (pickup_time) {
    const pickup = new Date(pickup_time);
    if (isNaN(pickup.getTime())) return next(new AppError("pickup_time غير صالح", 400));
    if (pickup <= new Date()) return next(new AppError("موعد الاستلام يجب أن يكون في المستقبل", 400));
    order.pickup_time = pickup;
  }

  if (delivery_time) {
    const delivery = new Date(delivery_time);
    if (isNaN(delivery.getTime())) return next(new AppError("delivery_time غير صالح", 400));
    if (delivery <= order.pickup_time) return next(new AppError("موعد التوصيل يجب أن يكون بعد موعد الاستلام", 400));
    order.delivery_time = delivery;
  }

  await order.save();
  res.status(200).json({ success: true, message: "تم تحديث المواعيد بنجاح", data: { order } });
});

module.exports = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  updateSchedule,
};