const Order           = require("../models/orderModel.js");
const OrderItem       = require("../models/orderItemModel.js");
const LaundryShop     = require("../models/laundryShopModel.js");
const ProviderService = require("../models/providerServiceModel.js");
const AppError        = require("../utils/AppError.js");
const catchAsync      = require("../utils/catchAsync.js");
const { onOrderDelivered } = require("./paymentController.js");
const mongoose        = require("mongoose");

const COMMISSION_RATE = 0.1;

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

// ══════════════════════════════════════════════════════════════
// 1. إنشاء طلب جديد
//    POST /api/orders
// ══════════════════════════════════════════════════════════════
const placeOrder = catchAsync(async (req, res, next) => {
  const clientId = req.user?._id ?? req.body.client;

  if (!mongoose.Types.ObjectId.isValid(clientId))
    return next(new AppError("client_id غير صالح", 400));

  const {
    provider,
    items,
    pickup_time,
    delivery_time,
    shipping_price = 0,
    notes,
    payment_method,
    delivery_type,
    delivery_address,
  } = req.body;

  // ── Validate payment method ───────────────────────────────
  if (!["card", "vodafone_cash", "cash"].includes(payment_method))
    return next(new AppError("طريقة الدفع غير صحيحة", 400));

  // ── Validate delivery type ────────────────────────────────
  if (!["pickup", "delivery"].includes(delivery_type))
    return next(new AppError("نوع التسليم غير صحيح — pickup أو delivery", 400));

  if (delivery_type === "delivery" && !delivery_address?.trim())
    return next(new AppError("عنوان التوصيل مطلوب", 400));

  // ── Validate IDs ──────────────────────────────────────────
  if (!mongoose.Types.ObjectId.isValid(provider))
    return next(new AppError("provider_id غير صالح", 400));

  if (!items?.length)
    return next(new AppError("items لا يمكن أن تكون فارغة", 400));

  // ── Check provider not suspended ─────────────────────────
  const providerDoc = await LaundryShop.findById(provider).lean();
  if (!providerDoc)
    return next(new AppError("المزود غير موجود", 404));
  if (providerDoc.is_suspended)
    return next(new AppError("هذا المزود موقوف حالياً بسبب عمولات غير مسددة، يرجى المحاولة لاحقاً", 403));

  // ── Normalize & validate items ────────────────────────────
  const normalizedItems = items.map((item) => ({
    serviceId: item.providerService_id ?? item.serviceId,
    quantity:  Math.max(parseInt(item.quantity) || 1, 1),
  }));

  const serviceIds = normalizedItems.map((i) => i.serviceId);

  if (!serviceIds.every((id) => mongoose.Types.ObjectId.isValid(id)))
    return next(new AppError("service id غير صالح", 400));

  // ── Validate dates ────────────────────────────────────────
  const pickup   = new Date(pickup_time);
  const delivery = delivery_time ? new Date(delivery_time) : null;

  if (isNaN(pickup.getTime()))
    return next(new AppError("pickup_time غير صالح", 400));
  if (pickup <= new Date())
    return next(new AppError("موعد الاستلام يجب أن يكون في المستقبل", 400));
  if (delivery && (isNaN(delivery.getTime()) || delivery <= pickup))
    return next(new AppError("delivery_time غير صالح", 400));

  // ── Fetch & validate services ─────────────────────────────
  const dbServices = await ProviderService.find({
    _id:       { $in: serviceIds },
    provider:  new mongoose.Types.ObjectId(provider),
    is_active: true,
  }).lean();

  if (dbServices.length !== serviceIds.length)
    return next(new AppError("بعض الخدمات غير موجودة أو غير نشطة", 400));

  // ── Calculate pricing ─────────────────────────────────────
  const priceMap = new Map(dbServices.map((s) => [s._id.toString(), Number(s.price)]));

  let provider_price = 0;
  const orderItemsData = normalizedItems.map((item) => {
    const unit_price = priceMap.get(item.serviceId);
    if (unit_price == null) throw new AppError("Service price not found", 400);
    const total_price = unit_price * item.quantity;
    provider_price += total_price;
    return { service: item.serviceId, quantity: item.quantity, unit_price, total_price };
  });

  const shipping = delivery_type === "pickup" ? 0 : Number(shipping_price) || 0;

  const total_price = Math.max(
    Math.round((provider_price + shipping) * 100) / 100,
    0
  );

  const platform_commission =
    payment_method !== "cash"
      ? Math.round(provider_price * COMMISSION_RATE * 100) / 100
      : 0;

  // ── Create order ──────────────────────────────────────────
  const order = await Order.create({
    client:              clientId,
    provider,
    pickup_time:         pickup,
    delivery_time:       delivery,
    provider_price,
    shipping_price:      shipping,
    discount:            0,
    total_price,
    platform_commission,
    payment_method,
    payment_status:      "pending",
    notes,
    status:              "pending",
    delivery_type,
    delivery_address:    delivery_type === "delivery" ? delivery_address.trim() : null,
  });

  // ── Insert order items ────────────────────────────────────
  await OrderItem.insertMany(
    orderItemsData.map((i) => ({ ...i, order: order._id }))
  );

  res.status(201).json({
    success: true,
    message: "تم إنشاء الطلب بنجاح",
    data: {
      order,
      pricing_summary: {
        provider_price,
        shipping_price:    shipping,
        total_price,
        platform_commission,
        provider_receives: Math.round((total_price - platform_commission) * 100) / 100,
      },
    },
  });
});

// ══════════════════════════════════════════════════════════════
// 2. جلب تفاصيل طلب واحد
//    GET /api/orders/:id
// ══════════════════════════════════════════════════════════════
const getOrderDetails = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("client",   "fullname email phone")
    .populate("provider", "name address lat lng")
    .lean();

  if (!order) return next(new AppError("الطلب غير موجود", 404));

  const items = await OrderItem.find({ order: order._id })
    .populate({ path: "service", select: "name" })
    .lean();

  res.status(200).json({
    success: true,
    data:    { order: { ...order, items } },
  });
});

// ══════════════════════════════════════════════════════════════
// 3. تحديث حالة الطلب (Provider)
//    PATCH /api/orders/:id/status
// ══════════════════════════════════════════════════════════════
const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  if (!status) return next(new AppError("الحالة الجديدة مطلوبة", 400));

  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("الطلب غير موجود", 404));

  const allowedNext = STATUS_FLOW[order.status] ?? [];
  if (!allowedNext.includes(status)) {
    return next(
      new AppError(
        `لا يمكن الانتقال من "${order.status}" إلى "${status}". ` +
        `الانتقالات المسموحة: [${allowedNext.join(", ") || "لا توجد — الطلب منتهي"}]`,
        400
      )
    );
  }

  order.status = status;
  await order.save();

  if (status === "delivered") {
    await onOrderDelivered(order);
  }

  res.status(200).json({
    success: true,
    message: `تم تحديث حالة الطلب إلى "${status}"`,
    data:    { order },
  });
});

// ══════════════════════════════════════════════════════════════
// 4. تعديل مواعيد الاستلام والتوصيل
//    PATCH /api/orders/:id/schedule
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
    if (isNaN(pickup.getTime()))
      return next(new AppError("pickup_time غير صالح", 400));
    if (pickup <= new Date())
      return next(new AppError("موعد الاستلام يجب أن يكون في المستقبل", 400));
    order.pickup_time = pickup;
  }

  if (delivery_time) {
    const delivery = new Date(delivery_time);
    if (isNaN(delivery.getTime()))
      return next(new AppError("delivery_time غير صالح", 400));
    if (delivery <= order.pickup_time)
      return next(new AppError("موعد التوصيل يجب أن يكون بعد موعد الاستلام", 400));
    order.delivery_time = delivery;
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "تم تحديث المواعيد بنجاح",
    data:    { order },
  });
});

// ══════════════════════════════════════════════════════════════
// 5. الطلبات النشطة للعميل
//    GET /api/orders/me/current
// ══════════════════════════════════════════════════════════════
const getCurrentOrders = catchAsync(async (req, res, next) => {
  const clientId = req.user?._id ?? req.query.client_id;
  if (!clientId) return next(new AppError("client_id مطلوب", 400));

  const ACTIVE_STATUSES = [
    "pending", "accepted", "picked_up", "in_progress", "ready", "out_for_delivery",
  ];

  const orders = await Order.find({
    client: clientId,
    status: { $in: ACTIVE_STATUSES },
  })
    .populate("provider", "name address")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    data:    { count: orders.length, orders },
  });
});

// ══════════════════════════════════════════════════════════════
// 6. سجل الطلبات المنتهية
//    GET /api/orders/me/history
// ══════════════════════════════════════════════════════════════
const getOrderHistory = catchAsync(async (req, res, next) => {
  const clientId = req.user?._id ?? req.query.client_id;
  if (!clientId) return next(new AppError("client_id مطلوب", 400));

  const page  = Math.max(parseInt(req.query.page)  || 1,  1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip  = (page - 1) * limit;

  const filter = { client: clientId, status: { $in: ["delivered", "cancelled"] } };

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("provider", "name address")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data:    { total, page, pages: Math.ceil(total / limit), orders },
  });
});

// ══════════════════════════════════════════════════════════════
// 7. كل الطلبات للعميل
//    GET /api/orders/me/all
// ══════════════════════════════════════════════════════════════
const getAllOrders = catchAsync(async (req, res, next) => {
  const clientId = req.user?._id ?? req.query.client_id;
  if (!clientId) return next(new AppError("client_id مطلوب", 400));

  const page  = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip  = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ client: clientId })
      .populate("provider", "name address")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ client: clientId }),
  ]);

  res.status(200).json({
    success: true,
    data:    { total, page, pages: Math.ceil(total / limit), orders },
  });
});

// ══════════════════════════════════════════════════════════════
// 8. Admin — كل الطلبات
//    GET /api/orders/admin/all
// ══════════════════════════════════════════════════════════════
const getAllOrdersForAdmin = catchAsync(async (req, res, next) => {
  const page  = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip  = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("client",   "fullname email phone")
      .populate("provider", "name address")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data:    { total, page, pages: Math.ceil(total / limit), orders },
  });
});

module.exports = {
  placeOrder,
  getOrderDetails,
  updateOrderStatus,
  updateSchedule,
  getCurrentOrders,
  getOrderHistory,
  getAllOrders,
  getAllOrdersForAdmin,
};
