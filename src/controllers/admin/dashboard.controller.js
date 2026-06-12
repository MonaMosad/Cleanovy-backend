const User = require("../../models/userModel");
const LaundryShop = require("../../models/laundryShopModel");
const Order = require("../../models/orderModel");
const ProviderService = require("../../models/providerServiceModel");
// ─── GET /api/admin/dashboard/stats ──────────────────────────────────────────
exports.getStats = async (req, res, next) => {
  try {
    const [totalClients, totalLaundries, totalOrders] = await Promise.all([
      User.countDocuments({ role: "client" }),
      LaundryShop.countDocuments({ is_verified: true }),
      Order.countDocuments(),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalClients,
        totalLaundries,
        totalOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/admin/dashboard/financial ──────────────────────────────────────
exports.getFinancial = async (req, res, next) => {
  try {
    const result = await Order.aggregate([
      { $match: { status: "delivered" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total_price" },
          totalProviderEarnings: { $sum: "$provider_price" },
          totalAdminCommission: { $sum: "$platform_commission" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const financial = result.length > 0
      ? {
          totalRevenue: result[0].totalRevenue,
          totalProviderEarnings: result[0].totalProviderEarnings,
          totalAdminCommission: result[0].totalAdminCommission,
          totalOrders: result[0].totalOrders,
        }
      : {
          totalRevenue: 0,
          totalProviderEarnings: 0,
          totalAdminCommission: 0,
          totalOrders: 0,
        };

    res.status(200).json({
      status: "success",
      data: financial,
    });
  } catch (error) {
    next(error);
  }
};
// ─── GET /api/admin/dashboard/recent-orders ──────────────────────────────────
exports.getRecentOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("client", "name")
      .populate("provider", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("_id client provider total_price status createdAt")
      .lean();

    // نعمل تنسيق لرقم الطلب
    const recentOrders = orders.map((order) => ({
      orderNumber: `ORD-${order._id.toString().slice(-6)}#`,
      client: order.client?.name || "غير معروف",
      provider: order.provider?.name || "غير معروف",
      amount: order.total_price,
      status: order.status,
      createdAt: order.createdAt,
    }));

    res.status(200).json({
      status: "success",
      data: recentOrders,
    });
  } catch (error) {
    next(error);
  }
};


// ─── GET /api/admin/dashboard/pending-laundries ──────────────────────────────
exports.getPendingLaundries = async (req, res, next) => {
  try {
    const laundries = await LaundryShop.find({ is_verified: false })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // نجيب الخدمات لكل مغسلة
    const result = await Promise.all(
      laundries.map(async (laundry) => {
        const services = await ProviderService.find({ provider: laundry._id })
          .populate("service", "name")
          .lean();

        return {
          id: laundry._id,
          name: laundry.name,
          email: laundry.user?.email || "غير معروف",
          services: services.map((s) => s.service?.name).filter(Boolean).join("، ") || "لا توجد خدمات",
          createdAt: laundry.createdAt,
        };
      })
    );

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/admin/dashboard/pending-laundries/:id/approve ────────────────
exports.approveLaundry = async (req, res, next) => {
  try {
    const laundry = await LaundryShop.findByIdAndUpdate(
      req.params.id,
      { is_verified: true },
      { new: true }
    );

    if (!laundry) {
      return res.status(404).json({ status: "fail", message: "المغسلة غير موجودة" });
    }

    res.status(200).json({
      status: "success",
      message: "تم قبول المغسلة بنجاح",
      data: laundry,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/admin/dashboard/pending-laundries/:id/reject ────────────────
exports.rejectLaundry = async (req, res, next) => {
  try {
    const laundry = await LaundryShop.findById(req.params.id);

    if (!laundry) {
      return res.status(404).json({ status: "fail", message: "المغسلة غير موجودة" });
    }

    // نمسح الخدمات بتاعت المغسلة
    await ProviderService.deleteMany({ provider: laundry._id });

    // نمسح الـ user
    await User.findByIdAndDelete(laundry.user);

    // نمسح المغسلة
    await LaundryShop.findByIdAndDelete(laundry._id);

    res.status(200).json({
      status: "success",
      message: "تم رفض المغسلة وحذفها بنجاح",
    });
  } catch (error) {
    next(error);
  }
};