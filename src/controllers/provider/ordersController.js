
// // controllers/provider/ordersController.js
// const Order = require("../../models/orderModel");
// const OrderItem = require("../../models/orderItemModel");
// const user = require("../../models/userModel");
// const Address = require("../../models/addressModel");
// const delivery = require("../../models/deliveryModel");
// // const ProviderService = require("../../models/providerServiceModel");
// const Service = require("../../models/serviceModel");
// const mongoose = require("mongoose");

// // ─────────────────────────────────────────────
// //  GET /provider/orders
// //  Query: ?status=pending|accepted|...
// // ─────────────────────────────────────────────
// const getOrders = async (req, res) => {
//   try {
//     // TODO: replace with req.user.id once auth middleware is active
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");

//     const { status } = req.query;

//     const filter = { provider: providerId };
//     if (status) filter.status = status;

//     const orders = await Order.find(filter)
//       .populate("client", "name phone")
//       .populate("address", "address")
//       .sort({ createdAt: -1 }); // newest first

//     res.status(200).json({
//       success: true,
//       nOfOrders: orders.length,
//       data: orders,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ─────────────────────────────────────────────
// //  GET /provider/orders/report/today
// //  ⚠ must be registered BEFORE /:id in the router
// // ─────────────────────────────────────────────
// const getTodayReport = async (req, res) => {
//   try {
//     // TODO: replace with req.user.id once auth middleware is active
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");

//     const startOfDay = new Date();
//     startOfDay.setUTCHours(0, 0, 0, 0);

//     const endOfDay = new Date();
//     endOfDay.setUTCHours(23, 59, 59, 999);

//     const orders = await Order.find({
//       provider: providerId,
//       createdAt: { $gte: startOfDay, $lte: endOfDay },
//     });

//     const totalOrders = orders.length;
//     const totalRevenue = orders
//       .filter((o) => o.status === "delivered")
//       .reduce((sum, o) => sum + o.total_price, 0);
//     const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
//     const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

//     res.status(200).json({
//       success: true,
//       data: {
//         totalOrders,
//         totalRevenue,
//         cancelledOrders,
//         deliveredOrders,
//         orders,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ─────────────────────────────────────────────
// //  GET /provider/orders/:id
// // ─────────────────────────────────────────────
// const getOrderById = async (req, res) => {
//   try {
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
//     const orderId = new mongoose.Types.ObjectId(req.params.id);

//     const order = await Order.findOne({ _id: orderId, provider: providerId })
//       .populate("client", "name phone")
//       .populate("address", "address")
//       .populate("delivery", "name phone");

//     if (!order) {
//       return res.status(404).json({ success: false, message: "الطلب مش موجود" });
//     }

//     const items = await OrderItem.find({ order: orderId }).populate({
//       path: "service",
//       select: "name parent",
//       populate: { path: "parent", select: "name" },
//     });

//     res.status(200).json({
//       success: true,
//       data: { ...order.toObject(), items },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ─────────────────────────────────────────────
// //  POST /provider/orders/:orderId/accept
// // ─────────────────────────────────────────────
// const acceptOrder = async (req, res) => {
//   try {
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
//     const orderId = new mongoose.Types.ObjectId(req.params.orderId);

//     const order = await Order.findOneAndUpdate(
//       { _id: orderId, provider: providerId, status: "pending" },
//       { status: "accepted" },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "الطلب مش موجود أو لا يعتبر طلب جديد",
//       });
//     }

//     res.status(200).json({ success: true, message: "تم قبول الطلب بنجاح", data: order });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ─────────────────────────────────────────────
// //  POST /provider/orders/:orderId/reject
// //  Body: { cancel_reason }
// // ─────────────────────────────────────────────
// const rejectOrder = async (req, res) => {
//   try {
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
//     const orderId = new mongoose.Types.ObjectId(req.params.orderId);
//     const { cancel_reason } = req.body;

//     if (!cancel_reason) {
//       return res.status(400).json({ success: false, message: "لازم تبعت سبب الرفض" });
//     }

//     const order = await Order.findOneAndUpdate(
//       { _id: orderId, provider: providerId, status: "pending" },
//       { status: "cancelled", cancel_reason },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "الطلب مش موجود أو مش في حالة طلب جديد",
//       });
//     }

//     res.status(200).json({ success: true, message: "تم رفض الطلب", data: order });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ─────────────────────────────────────────────
// //  PATCH /provider/orders/:orderId/status
// //  Body: { status }
// // ─────────────────────────────────────────────
// const updateOrderStatus = async (req, res) => {
//   try {
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
//     const orderId = new mongoose.Types.ObjectId(req.params.orderId);
//     const { status } = req.body;

//     const allowedStatuses = [
//       "accepted",
//       "in_progress",
//       "ready",
//       "out_for_delivery",
//       "delivered",
//       "cancelled", // ← added: provider can cancel non-pending orders too
//     ];

//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({ success: false, message: "حالة غير صحيحة" });
//     }

//     const order = await Order.findOneAndUpdate(
//       { _id: orderId, provider: providerId },
//       { status },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({ success: false, message: "الطلب مش موجود" });
//     }

//     res.status(200).json({ success: true, data: order });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = {
//   getOrders,
//   getOrderById,
//   acceptOrder,
//   rejectOrder,
//   updateOrderStatus,
//   getTodayReport,
// };







// const Order = require("../../models/orderModel");
// const OrderItem = require("../../models/orderItemModel");
// const Service = require("../../models/serviceModel");

// const getOrders = async (req, res) => {
//   try {
//     const providerId = req.user._id;
//     console.log("Provider ID:", req.user._id);
//     const { status } = req.query;
//     const filter = { provider: providerId };
//     if (status) filter.status = status;

//     const orders = await Order.find(filter)
//       .populate("client", "name fullName phone")
//       .populate("address", "address")
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, nOfOrders: orders.length, data: orders });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getTodayReport = async (req, res) => {
//   try {
//     const providerId = req.user._id;
//     const startOfDay = new Date(); startOfDay.setUTCHours(0, 0, 0, 0);
//     const endOfDay = new Date(); endOfDay.setUTCHours(23, 59, 59, 999);

//     const orders = await Order.find({ provider: providerId, createdAt: { $gte: startOfDay, $lte: endOfDay } });
//     const totalRevenue = orders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.total_price, 0);

//     res.status(200).json({
//       success: true,
//       data: {
//         totalOrders: orders.length,
//         totalRevenue,
//         cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
//         deliveredOrders: orders.filter((o) => o.status === "delivered").length,
//         orders,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const getOrderById = async (req, res) => {
//   try {
//     const providerId = req.user._id;
//     const order = await Order.findOne({ _id: req.params.id, provider: providerId })
//       .populate("client", "name fullName phone")
//       .populate("address", "address")
//       .populate("delivery", "name phone");

//     if (!order) return res.status(404).json({ success: false, message: "الطلب مش موجود" });

//     const items = await OrderItem.find({ order: order._id }).populate({
//       path: "service", select: "name parent", populate: { path: "parent", select: "name" },
//     });

//     res.status(200).json({ success: true, data: { ...order.toObject(), items } });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const acceptOrder = async (req, res) => {
//   try {
//     const providerId = req.user._id;
//     const order = await Order.findOneAndUpdate(
//       { _id: req.params.orderId, provider: providerId, status: "pending" },
//       { status: "accepted" }, { new: true }
//     );
//     if (!order) return res.status(404).json({ success: false, message: "الطلب مش موجود أو مش جديد" });
//     res.status(200).json({ success: true, message: "تم قبول الطلب بنجاح", data: order });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const rejectOrder = async (req, res) => {
//   try {
//     const providerId = req.user._id;
//     const { cancel_reason } = req.body;
//     if (!cancel_reason) return res.status(400).json({ success: false, message: "لازم تبعت سبب الرفض" });

//     const order = await Order.findOneAndUpdate(
//       { _id: req.params.orderId, provider: providerId, status: "pending" },
//       { status: "cancelled", cancel_reason }, { new: true }
//     );
//     if (!order) return res.status(404).json({ success: false, message: "الطلب مش موجود" });
//     res.status(200).json({ success: true, message: "تم رفض الطلب", data: order });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// const updateOrderStatus = async (req, res) => {
//   try {
//     const providerId = req.user._id;
//     const { status } = req.body;
//     const allowedStatuses = ["accepted", "in_progress", "ready", "out_for_delivery", "delivered", "cancelled"];
//     if (!allowedStatuses.includes(status)) return res.status(400).json({ success: false, message: "حالة غير صحيحة" });

//     const order = await Order.findOneAndUpdate(
//       { _id: req.params.orderId, provider: providerId },
//       { status }, { new: true }
//     );
//     if (!order) return res.status(404).json({ success: false, message: "الطلب مش موجود" });
//     res.status(200).json({ success: true, data: order });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = { getOrders, getOrderById, acceptOrder, rejectOrder, updateOrderStatus, getTodayReport };


const Order = require("../../models/orderModel");
const OrderItem = require("../../models/orderItemModel");

const getOrders = async (req, res) => {
  try {
    const providerId = req.user._id;
    const { status } = req.query;
    const filter = { provider: providerId };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate("client", "fullName name phone")
      .populate("address", "address")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, nOfOrders: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTodayReport = async (req, res) => {
  try {
    const providerId = req.user._id;
    const startOfDay = new Date(); startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(); endOfDay.setUTCHours(23, 59, 59, 999);

    const orders = await Order.find({ provider: providerId, createdAt: { $gte: startOfDay, $lte: endOfDay } });
    const totalRevenue = orders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.total_price, 0);

    res.status(200).json({
      success: true,
      data: {
        totalOrders: orders.length, totalRevenue,
        cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
        deliveredOrders: orders.filter((o) => o.status === "delivered").length,
        orders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const providerId = req.user._id;
    const order = await Order.findOne({ _id: req.params.id, provider: providerId })
      .populate("client", "fullName name phone")
      .populate("address", "address")
      .populate("delivery", "name phone");

    if (!order) return res.status(404).json({ success: false, message: "الطلب مش موجود" });

    const items = await OrderItem.find({ order: order._id }).populate({
      path: "service", select: "name parent", populate: { path: "parent", select: "name" },
    });

    res.status(200).json({ success: true, data: { ...order.toObject(), items } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const acceptOrder = async (req, res) => {
  try {
    const providerId = req.user._id;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, provider: providerId, status: "pending" },
      { status: "accepted" }, { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: "الطلب مش موجود أو مش جديد" });
    res.status(200).json({ success: true, message: "تم قبول الطلب بنجاح", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const rejectOrder = async (req, res) => {
  try {
    const providerId = req.user._id;
    const { cancel_reason } = req.body;
    if (!cancel_reason) return res.status(400).json({ success: false, message: "لازم تبعت سبب الرفض" });

    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, provider: providerId, status: "pending" },
      { status: "cancelled", cancel_reason }, { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: "الطلب مش موجود" });
    res.status(200).json({ success: true, message: "تم رفض الطلب", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const providerId = req.user._id;
    const { status } = req.body;
    const allowedStatuses = ["accepted", "in_progress", "ready", "out_for_delivery", "delivered", "cancelled"];
    if (!allowedStatuses.includes(status)) return res.status(400).json({ success: false, message: "حالة غير صحيحة" });

    const order = await Order.findOneAndUpdate(
      { _id: req.params.orderId, provider: providerId },
      { status }, { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: "الطلب مش موجود" });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getOrders, getOrderById, acceptOrder, rejectOrder, updateOrderStatus, getTodayReport };