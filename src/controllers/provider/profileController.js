// controllers/provider/profileController.js
const User = require("../../models/userModel");
const LaundryShop = require("../../models/laundryShopModel");
const Order = require("../../models/orderModel");

/**
 * GET /provider/profile
 * Returns provider's personal info + shop info + order stats
 */
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    const shop = req.shop;

    // Order stats
    const orders = await Order.find({ provider: shop._id });
    const done = orders.filter((o) => o.status === "delivered").length;
    const processing = orders.filter((o) => o.status === "in_progress" || o.status === "accepted").length;

    res.status(200).json({
      success: true,
      data: {
        // personal info (Profile page: المعلومات الشخصية)
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: shop.role || "مدير العمليات",

        // shop info (Profile page: معلومات المغسلة)
        businessName: shop.name,
        businessAddress: shop.address,

        // stats shown in the profile card
        orderStats: { done, processing },

        // meta
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /provider/profile
 * Update personal info and/or shop info.
 * Body: { name?, email?, phone?, role?, businessName?, businessAddress? }
 */
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, role, businessName, businessAddress } = req.body;

    // Update User fields
    const userUpdates = {};
    if (name) userUpdates.name = name;
    if (email) userUpdates.email = email;
    if (phone) userUpdates.phone = phone;

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(req.user._id, userUpdates);
    }

    // Update LaundryShop fields
    const shopUpdates = {};
    if (businessName) shopUpdates.name = businessName;
    if (businessAddress) shopUpdates.address = businessAddress;
    if (role) shopUpdates.role = role;

    if (Object.keys(shopUpdates).length > 0) {
      await LaundryShop.findByIdAndUpdate(req.shop._id, shopUpdates);
    }

    res.status(200).json({ success: true, message: "تم تحديث الملف الشخصي بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile };