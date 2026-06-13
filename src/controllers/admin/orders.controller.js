const mongoose = require("mongoose");
const Order = require("../../models/orderModel");
const ProviderService = require("../../models/providerServiceModel");
const OrderItem = require("../../models/orderItemModel");

// نجمّع كل الحالات في 4 مجموعات زي التبويبات في الـ UI
const STATUS_GROUPS = {
  pending:    ["pending"],                                              // قيد الانتظار
  processing: ["accepted", "picked_up", "in_progress", "ready", "out_for_delivery"], // قيد التنفيذ
  completed:  ["delivered"],                                            // مكتمل
  cancelled:  ["cancelled"],                                            // ملغي
};

/* ──────────────────────────────────────────────────────────────
   1) لستة الطلبات + فلتر بالحالة/المغسلة + سيرش + pagination + العدّادات
   GET /api/admin/orders?tab=&provider=&search=&page=&limit=
   - tab: all | pending | processing | completed | cancelled
   - provider: id المغسلة (للفلتر بالمغسلة)
   - search: بيدوّر في رقم الطلب (آخر 6 حروف)
────────────────────────────────────────────────────────────── */
exports.getOrders = async (req, res, next) => {
  try {
    const page  = Math.max(parseInt(req.query.page)  || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip  = (page - 1) * limit;
    const tab      = req.query.tab || "all";
    const provider = req.query.provider;
    const search   = (req.query.search || "").trim();

    const query = {};

    // فلتر بالحالة حسب التبويب
    if (tab !== "all" && STATUS_GROUPS[tab]) {
      query.status = { $in: STATUS_GROUPS[tab] };
    }

    // فلتر بالمغسلة
    if (provider && mongoose.Types.ObjectId.isValid(provider)) {
      query.provider = provider;
    }

    // سيرش بآخر 6 حروف من الـ id
    if (search) {
      const cleaned = search.replace(/[^a-fA-F0-9]/g, ""); // نشيل ORD- و #
      if (cleaned) {
        query.$expr = {
          $regexMatch: {
            input: { $toString: "$_id" },
            regex: cleaned + "$",
            options: "i",
          },
        };
      }
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .select("client provider total_price status createdAt")
        .populate("client", "fullName")
        .populate("provider", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    // الخدمات لكل أوردر (من OrderItem)
    const orderIds = orders.map((o) => o._id);
    const items = await OrderItem.find({ order: { $in: orderIds } })
      .populate("service", "name")
      .select("order service")
      .lean();

    const itemsMap = {};
    items.forEach((it) => {
      const oid = it.order.toString();
      if (!itemsMap[oid]) itemsMap[oid] = [];
      itemsMap[oid].push(it.service?.name);
    });

    // العدّادات لكل تبويب (مع احترام فلتر المغسلة لو موجود)
    const countQuery = {};
    if (provider && mongoose.Types.ObjectId.isValid(provider)) countQuery.provider = provider;

    const [all, pending, processing, completed, cancelled] = await Promise.all([
      Order.countDocuments(countQuery),
      Order.countDocuments({ ...countQuery, status: { $in: STATUS_GROUPS.pending } }),
      Order.countDocuments({ ...countQuery, status: { $in: STATUS_GROUPS.processing } }),
      Order.countDocuments({ ...countQuery, status: { $in: STATUS_GROUPS.completed } }),
      Order.countDocuments({ ...countQuery, status: { $in: STATUS_GROUPS.cancelled } }),
    ]);

    res.json({
      status: "success",
      data: {
        counts: { all, pending, processing, completed, cancelled },
        orders: orders.map((o) => ({
          id:          o._id,
          orderNumber: `ORD-${o._id.toString().slice(-6)}#`,
          client:      o.client?.fullName || "—",
          provider:    o.provider?.name || "—",
          services:    itemsMap[o._id.toString()] || [],
          amount:      o.total_price,
          status:      o.status,
          createdAt:   o.createdAt,
        })),
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ──────────────────────────────────────────────────────────────
   2) تفاصيل أوردر واحد (أيقونة العين) — read-only
   GET /api/admin/orders/:id
────────────────────────────────────────────────────────────── */
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid order id" });
    }

    const order = await Order.findById(id)
      .populate("client", "fullName email phone")
      .populate("provider", "name phone address")
      .populate("address")
      .lean();

    if (!order) {
      return res.status(404).json({ status: "fail", message: "Order not found" });
    }

    // الخدمات/الأصناف بتفاصيلها
    const items = await OrderItem.find({ order: id })
      .populate("service", "name")
      .select("service quantity unit_price total_price")
      .lean();

    res.json({
      status: "success",
      data: {
        id:          order._id,
        orderNumber: `ORD-${order._id.toString().slice(-6)}#`,
        client: order.client
          ? { name: order.client.fullName, email: order.client.email, phone: order.client.phone }
          : null,
        provider: order.provider
          ? { name: order.provider.name, phone: order.provider.phone, address: order.provider.address }
          : null,
        deliveryType: order.delivery_type,
        address: order.address?.address || null,
        items: items.map((it) => ({
          name:       it.service?.name,
          quantity:   it.quantity,
          unitPrice:  it.unit_price,
          totalPrice: it.total_price,
        })),
        pricing: {
          providerPrice:      order.provider_price,
          shippingPrice:      order.shipping_price,
          discount:           order.discount,
          totalPrice:         order.total_price,
          platformCommission: order.platform_commission,
        },
        payment: {
          method: order.payment_method,
          status: order.payment_status,
        },
        status:       order.status,
        pickupTime:   order.pickup_time,
        deliveryTime: order.delivery_time,
        notes:        order.notes,
        createdAt:    order.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};