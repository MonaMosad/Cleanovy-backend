// controllers/adminController.js
const User = require("../../models/userModel.js");
const LaundryShop = require("../../models/laundryShopModel.js");
const Order = require("../../models/orderModel.js");

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = role ? { role } : {};
    const [users, total] = await Promise.all([
      User.find(filter).select("-password").skip((page - 1) * limit).limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);
    res.json({ total, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/shops  (includes unverified)
const getAllShops = async (req, res) => {
  try {
    const { verified, page = 1, limit = 20 } = req.query;
    const filter = verified !== undefined ? { is_verified: verified === "true" } : {};
    const [shops, total] = await Promise.all([
      LaundryShop.find(filter).populate("user", "name email").skip((page - 1) * limit).limit(parseInt(limit)),
      LaundryShop.countDocuments(filter),
    ]);
    res.json({ total, shops });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/admin/shops/:id/verify
const verifyShop = async (req, res) => {
  try {
    const shop = await LaundryShop.findByIdAndUpdate(
      req.params.id,
      { is_verified: true },
      { new: true }
    );
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/stats
const getPlatformStats = async (req, res) => {
  try {
    const [totalUsers, totalShops, verifiedShops, totalOrders, revenueResult] = await Promise.all([
      User.countDocuments(),
      LaundryShop.countDocuments(),
      LaundryShop.countDocuments({ is_verified: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$app_price" } } },
      ]),
    ]);
    res.json({
      totalUsers,
      totalShops,
      verifiedShops,
      totalOrders,
      platformRevenue: revenueResult[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllUsers, getAllShops, verifyShop, getPlatformStats };
