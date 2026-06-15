
// // controllers/provider/dashboardController.js
// const Order = require("../../models/orderModel");
// const OrderItem = require("../../models/orderItemModel");
// const mongoose = require("mongoose");

// // ── Shared helper — builds the dashboard data object ────────────────────────
// const buildDashboardData = async (providerId) => {
//   const startOfDay = new Date();
//   startOfDay.setUTCHours(0, 0, 0, 0);
//   const endOfDay = new Date();
//   endOfDay.setUTCHours(23, 59, 59, 999);

//   // Today's orders
//   const todayOrders = await Order.find({
//     provider: providerId,
//     createdAt: { $gte: startOfDay, $lte: endOfDay },
//   });

//   const countByStatus = (status) =>
//     todayOrders.filter((o) => o.status === status).length;

//   const todayRevenue = todayOrders
//     .filter((o) => o.status === "delivered")
//     .reduce((sum, o) => sum + o.total_price, 0);

//   // Capacity
//   const activeStatuses = ["pending", "accepted", "in_progress", "ready", "out_for_delivery"];
//   const activeCount = todayOrders.filter((o) => activeStatuses.includes(o.status)).length;
//   const capacityPct = Math.min(Math.round((activeCount / 20) * 100), 100);

//   // Urgent orders (pending)
//   const pendingOrders = await Order.find({ provider: providerId, status: "pending" })
//     .populate("client", "name phone")
//     .populate("address", "address")
//     .sort({ createdAt: 1 });

//   const urgentOrders = await Promise.all(
//     pendingOrders.map(async (order) => {
//       const items = await OrderItem.find({ order: order._id }).populate("service", "name");
//       const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
//       const serviceNames = [...new Set(items.map((i) => i.service?.name).filter(Boolean))];
//       return {
//         _id: order._id,
//         total_price: order.total_price,
//         pickup_time: order.pickup_time,
//         notes: order.notes,
//         client: order.client,
//         address: order.address,
//         itemsSummary: { totalQty, serviceNames },
//       };
//     })
//   );

//   // Last 7 days revenue chart
//   const sevenDaysAgo = new Date();
//   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
//   sevenDaysAgo.setUTCHours(0, 0, 0, 0);

//   const recentOrders = await Order.find({
//     provider: providerId,
//     status: "delivered",
//     createdAt: { $gte: sevenDaysAgo },
//   }).select("total_price createdAt");

//   const revenueByDay = {};
//   for (let i = 6; i >= 0; i--) {
//     const d = new Date();
//     d.setDate(d.getDate() - i);
//     revenueByDay[d.toISOString().slice(0, 10)] = 0;
//   }
//   recentOrders.forEach((o) => {
//     const key = o.createdAt.toISOString().slice(0, 10);
//     if (revenueByDay[key] !== undefined) revenueByDay[key] += o.total_price;
//   });

//   const revenueChart = Object.entries(revenueByDay).map(([date, revenue]) => ({ date, revenue }));

//   return {
//     stats: {
//       new: countByStatus("pending"),
//       processing: countByStatus("accepted") + countByStatus("in_progress"),
//       ready: countByStatus("ready"),
//       delivering: countByStatus("out_for_delivery"),
//       done: countByStatus("delivered"),
//       cancelled: countByStatus("cancelled"),
//       revenue: todayRevenue,
//     },
//     capacityPct,
//     outForDeliveryCount: countByStatus("out_for_delivery"),
//     urgentOrders,
//     revenueChart,
//   };
// };

// // ── GET /provider/dashboard ─────────────────────────────────────────────────
// const getDashboardStats = async (req, res) => {
//   try {
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
//     const data = await buildDashboardData(providerId);
//     res.status(200).json({ success: true, data });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ── GET /provider/dashboard/live  (SSE) ─────────────────────────────────────
// const getDashboardLive = async (req, res) => {
//   const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");

//   // SSE headers
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.flushHeaders();

//   const send = async () => {
//     try {
//       const data = await buildDashboardData(providerId);
//       res.write(`data: ${JSON.stringify(data)}\n\n`);
//     } catch (err) {
//       console.error("SSE send error:", err.message);
//     }
//   };

//   // send immediately then every 10 seconds
//   await send();
//   const interval = setInterval(send, 10000);

//   // cleanup when client disconnects
//   req.on("close", () => {
//     clearInterval(interval);
//     res.end();
//   });
// };

// module.exports = { getDashboardStats, getDashboardLive };












const Order = require("../../models/orderModel");
const OrderItem = require("../../models/orderItemModel");

const buildDashboardData = async (providerId, maxOrders = 20) => {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setUTCHours(23, 59, 59, 999);

  const todayOrders = await Order.find({
    provider: providerId,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  const countByStatus = (status) => todayOrders.filter((o) => o.status === status).length;
  const todayRevenue = todayOrders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.total_price, 0);

  const activeStatuses = ["pending", "accepted", "in_progress", "ready", "out_for_delivery"];
  const activeCount = todayOrders.filter((o) => activeStatuses.includes(o.status)).length;
  const capacityPct = Math.min(Math.round((activeCount / maxOrders) * 100), 100);

  const pendingOrders = await Order.find({ provider: providerId, status: "pending" })
    .populate("client", "name fullName phone")
    .populate("address", "address")
    .sort({ createdAt: 1 });

  const urgentOrders = await Promise.all(
    pendingOrders.map(async (order) => {
      const items = await OrderItem.find({ order: order._id }).populate("service", "name");
      const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
      const serviceNames = [...new Set(items.map((i) => i.service?.name).filter(Boolean))];
      return {
        _id: order._id,
        total_price: order.total_price,
        pickup_time: order.pickup_time,
        notes: order.notes,
        client: order.client,
        address: order.address,
        itemsSummary: { totalQty, serviceNames },
      };
    })
  );

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setUTCHours(0, 0, 0, 0);

  const recentOrders = await Order.find({
    provider: providerId,
    status: "delivered",
    createdAt: { $gte: sevenDaysAgo },
  }).select("total_price createdAt");

  const revenueByDay = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    revenueByDay[d.toISOString().slice(0, 10)] = 0;
  }
  recentOrders.forEach((o) => {
    const key = o.createdAt.toISOString().slice(0, 10);
    if (revenueByDay[key] !== undefined) revenueByDay[key] += o.total_price;
  });

  return {
    stats: {
      new: countByStatus("pending"),
      processing: countByStatus("accepted") + countByStatus("in_progress"),
      ready: countByStatus("ready"),
      delivering: countByStatus("out_for_delivery"),
      done: countByStatus("delivered"),
      cancelled: countByStatus("cancelled"),
      revenue: todayRevenue,
    },
    capacityPct,
    outForDeliveryCount: countByStatus("out_for_delivery"),
    urgentOrders,
    revenueChart: Object.entries(revenueByDay).map(([date, revenue]) => ({ date, revenue })),
  };
};

const getDashboardStats = async (req, res) => {
  try {
    const providerId = req.user._id;
    const maxOrders = req.shop.max_daily_orders ?? 20;
    const data = await buildDashboardData(providerId, maxOrders);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboardLive = async (req, res) => {
  const providerId = req.user._id;
  const maxOrders = req.shop.max_daily_orders ?? 20;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  const send = async () => {
    try {
      const data = await buildDashboardData(providerId, maxOrders);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (err) {
      console.error("SSE send error:", err.message);
    }
  };

  await send();
  const interval = setInterval(send, 10000);
  req.on("close", () => { clearInterval(interval); res.end(); });
};

module.exports = { getDashboardStats, getDashboardLive };