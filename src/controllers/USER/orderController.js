// controllers/orderController.js
const mongoose = require("mongoose");
const Order = require("../../models/orderModel.js");
const OrderItem = require("../../models/orderItemModel.js");
const ProviderService = require("../../models/providerServiceModel.js");
const LaundryShop = require("../../models/laundryShopModel.js");

const ORDER_STATUSES = [
  "pending", "accepted", "picked_up", "in_progress",
  "ready", "out_for_delivery", "delivered", "cancelled",
];

// ─── POST /api/orders  (Client places an order) ──────────────────────────────
const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { provider, items, pickup_time, notes } = req.body;
    // items: [{ provider_service_id, quantity }]

    if (!provider || !items?.length || !pickup_time)
      return res.status(400).json({ message: "provider, items and pickup_time required" });

    const shop = await LaundryShop.findById(provider).session(session);
    if (!shop) return res.status(404).json({ message: "Provider not found" });

    // Resolve prices from ProviderService
    let provider_price = 0;
    const orderItemDocs = [];

    for (const item of items) {
      const ps = await ProviderService.findOne({
        _id: item.provider_service_id,
        provider,
        is_active: true,
      }).session(session);

      if (!ps) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Service ${item.provider_service_id} not available` });
      }

      const qty = item.quantity || 1;
      const itemTotal = ps.price * qty;
      provider_price += itemTotal;

      orderItemDocs.push({
        service: ps._id,
        quantity: qty,
        unit_price: ps.price,
        total_price: itemTotal,
      });
    }

    const APP_FEE_RATE = 0.05; // 5% app fee
    const SHIPPING = 10;
    const app_price = parseFloat((provider_price * APP_FEE_RATE).toFixed(2));
    const total_price = provider_price + app_price + SHIPPING;

    const [order] = await Order.create(
      [
        {
          provider,
          client: req.user._id,
          pickup_time,
          notes,
          provider_price,
          app_price,
          shipping_price: SHIPPING,
          total_price,
        },
      ],
      { session }
    );

    // Attach order id to items then bulk insert
    const itemsWithOrder = orderItemDocs.map((i) => ({ ...i, order: order._id }));
    await OrderItem.insertMany(itemsWithOrder, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ order, items: itemsWithOrder });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/orders  (Client: own orders | Provider: shop orders) ───────────
const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (req.user.role === "client") {
      filter.client = req.user._id;
    } else if (req.user.role === "provider") {
      const shop = await LaundryShop.findOne({ user: req.user._id });
      if (!shop) return res.status(404).json({ message: "No shop found" });
      filter.provider = shop._id;
    }

    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("provider", "name address")
        .populate("client", "name phone")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit)),
      Order.countDocuments(filter),
    ]);

    res.json({ total, page: parseInt(page), orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/orders/:id  (Order detail with items) ──────────────────────────
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("provider", "name address lat lng")
      .populate("client", "name phone email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Access control
    const isClient = order.client._id.toString() === req.user._id.toString();
    const shop = req.user.role === "provider"
      ? await LaundryShop.findOne({ user: req.user._id })
      : null;
    const isProvider = shop && order.provider._id.toString() === shop._id.toString();

    if (!isClient && !isProvider && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const items = await OrderItem.find({ order: order._id }).populate({
      path: "service",
      populate: { path: "service", select: "name" },
    });

    res.json({ order, items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── PATCH /api/orders/:id/status  (Provider/Admin updates status) ────────────
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!ORDER_STATUSES.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Provider can only update their own orders
    if (req.user.role === "provider") {
      const shop = await LaundryShop.findOne({ user: req.user._id });
      if (!shop || order.provider.toString() !== shop._id.toString())
        return res.status(403).json({ message: "Forbidden" });
    }

    // Client can only cancel pending orders
    if (req.user.role === "client") {
      if (status !== "cancelled" || order.status !== "pending")
        return res.status(403).json({ message: "Clients can only cancel pending orders" });
    }

    order.status = status;
    if (status === "delivered") order.delivery_time = new Date();
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/orders/:id/items ────────────────────────────────────────────────
const getOrderItems = async (req, res) => {
  try {
    const items = await OrderItem.find({ order: req.params.id }).populate({
      path: "service",
      populate: { path: "service", select: "name parent" },
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus, getOrderItems };
