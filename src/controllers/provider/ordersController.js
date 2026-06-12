const Order = require("../../models/orderModel");
const OrderItem = require("../../models/orderItemModel");
const User = require("../../models/userModel");
// const ProviderService = require("../../models/providerServiceModel");
const Service = require("../../models/serviceModel");
const Address = require("../../models/addressModel");
const delivery = require("../../models/deliveryModel");
const mongoose = require("mongoose");

// get all orders for the provider

const getOrders = async (req, res) => {
  try {
    // const providerId = req.user.id; // جاي من الـ auth middleware

    const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");

    const { status } = req.query;

    // بنبني الـ filter
    const filter = { provider: providerId };
    if (status) filter.status = status;

    const orders = await Order.find(filter);

    res.status(200).json({
      success: true,
      nOforders: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
    const orderId = new mongoose.Types.ObjectId(req.params.id);

    const order = await Order.findOne({
      _id: orderId,
      provider: providerId,
    })
      .populate("client", "name phone")
      .populate("address", "address")
      .populate("delivery", "name phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "الطلب مش موجود",
      });
    }

    console.log(orderId);

    const items = await OrderItem.find({ order: orderId }).populate({
      path: "service",
      select: "name parent",
      populate: {
        path: "parent", // populate جوا populate
        select: "name", // هتجيبي اسم الـ parent بس
      },
    });
    //  .populate("service","name  parent" )

    console.log(items);

    res.status(200).json({
      success: true,
      data: { ...order._doc, items },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const acceptOrder = async (req, res) => {
  try {
    const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
    const orderId = new mongoose.Types.ObjectId(req.params.orderId);

    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        provider: providerId,
        status: "طلب جديد",
      },
      { status: "accepted" },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "الطلب مش موجود أو لا يعتبر طلب جديد",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "تم قبول الطلب بنجاح", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const rejectOrder = async (req, res) => {
  try {
    // const providerId = req.user.id;
    const providerId = new mongoose.Types.ObjectId("dd0000000000000000000002");
    const orderId = new mongoose.Types.ObjectId(req.params.orderId);
    const { cancel_reason } = req.body;

    if (!cancel_reason) {
      return res.status(400).json({
        success: false,
        message: "لازم تبعت سبب الرفض",
      });
    }

    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        provider: providerId,
        status: "طلب جديد",
      },
      {
        status: "cancelled",
        cancel_reason,
      },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "الطلب مش موجود أو مش في حالة طلب جديد",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "تم رفض الطلب ", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const providerId = new mongoose.Types.ObjectId("dd0000000000000000000002");
    const orderId = new mongoose.Types.ObjectId(req.params.orderId);
    const { status } = req.body;

    const allowedStatuses = [
      "مقبول",
      "قيد التنفيذ",
      "جاهز",
      "خارج للتوصيل",
      "تم التوصيل",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "حالة غير صحيحة",
      });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, provider: providerId },
      { status },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "الطلب مش موجود",
      });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTodayReport = async (req, res) => {
  try {
    // const providerId = req.user.id;
    const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");

    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);
    console.log(startOfDay, endOfDay);

    const orders = await Order.find({
      provider: providerId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    // إحصائيات
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total_price, 0);
    const cancelledOrders = orders.filter(
      (o) => o.status === "cancelled",
    ).length;
    const deliveredOrders = orders.filter(
      (o) => o.status === "delivered",
    ).length;

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        cancelledOrders,
        deliveredOrders,
        orders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  getOrders,
  getOrderById,
  acceptOrder,
  rejectOrder,
  updateOrderStatus,
  getTodayReport,
};
