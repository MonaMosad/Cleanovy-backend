












// // controllers/provider/profileController.js
// const User = require("../../models/userModel");
// const LaundryShop = require("../../models/laundryShopModel");
// const Order = require("../../models/orderModel");

// /**
//  * GET /provider/profile
//  */
// const getProfile = async (req, res) => {
//   try {
//     const user = req.user;
//     const shop = req.shop;

//     const orders = await Order.find({ provider: shop._id });
//     const done = orders.filter((o) => o.status === "delivered").length;
//     const processing = orders.filter((o) =>
//       o.status === "in_progress" || o.status === "accepted"
//     ).length;

//     // support both old (name) and new (fullName) user models
//     const userName = user.fullName || user.name || "";

//     res.status(200).json({
//       success: true,
//       data: {
//         name: userName,
//         email: user.email,
//         phone: user.phone || shop.phone || "",
//         role: shop.role || "مدير العمليات",
//         businessName: shop.name,
//         businessAddress: shop.address || "",
//         orderStats: { done, processing },
//         createdAt: user.createdAt,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * PATCH /provider/profile
//  * Body: { name?, email?, phone?, businessAddress? }
//  */
// const updateProfile = async (req, res) => {
//   try {
//     const { name, email, phone, businessAddress } = req.body;

//     // Update User fields — support both fullName and name
//     const userUpdates = {};
//     if (name) {
//       userUpdates.fullName = name;
//       userUpdates.name = name; // fallback for old schema
//     }
//     if (email) userUpdates.email = email;
//     if (phone) userUpdates.phone = phone;

//     if (Object.keys(userUpdates).length > 0) {
//       await User.findByIdAndUpdate(req.user._id, userUpdates);
//     }

//     // Update shop fields
//     const shopUpdates = {};
//     if (businessAddress) shopUpdates.address = businessAddress;
//     if (phone) shopUpdates.phone = phone;

//     if (Object.keys(shopUpdates).length > 0) {
//       await LaundryShop.findByIdAndUpdate(req.shop._id, shopUpdates);
//     }

//     res.status(200).json({ success: true, message: "تم تحديث الملف الشخصي بنجاح" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = { getProfile, updateProfile };















// // controllers/provider/profileController.js
// const User = require("../../models/userModel");
// const LaundryShop = require("../../models/laundryShopModel");
// const Order = require("../../models/orderModel");
// const mongoose = require("mongoose");

// // TODO: remove hardcoded IDs after auth is connected
// const HARDCODED_USER_ID = new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaa04");
// const HARDCODED_SHOP_ID = new mongoose.Types.ObjectId("dd0000000000000000000002");

// /**
//  * GET /provider/profile
//  */
// const getProfile = async (req, res) => {
//   try {
//     // TODO: replace with req.user and req.shop after auth
//     const user = await User.findById(HARDCODED_USER_ID);
//     const shop = await LaundryShop.findById(HARDCODED_SHOP_ID);

//     if (!user || !shop) {
//       return res.status(404).json({ success: false, message: "المستخدم أو المغسلة مش موجود" });
//     }

//     const orders = await Order.find({ provider: shop._id });
//     const done = orders.filter((o) => o.status === "delivered").length;
//     const processing = orders.filter((o) =>
//       o.status === "in_progress" || o.status === "accepted"
//     ).length;

   
//     const userName = user.fullName || user.name || user.username || "";

//     res.status(200).json({
//       success: true,
//       data: {
//         name: userName,
//         email: user.email,
//         phone: user.phone || shop.phone || "",
//         role: shop.role || "مدير العمليات",
//         businessName: shop.name,
//         businessAddress: shop.address || "",
//         orderStats: { done, processing },
//         createdAt: user.createdAt,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * PATCH /provider/profile
//  * Body: { name?, email?, phone?, businessAddress? }
//  */
// const updateProfile = async (req, res) => {
//   try {
//     // TODO: replace with req.user._id and req.shop._id after auth
//     const { name, email, phone, businessAddress } = req.body;

//     const userUpdates = {};
//     if (name) {
//       userUpdates.fullName = name;
//       userUpdates.name = name;
//     }
//     if (email) userUpdates.email = email;
//     if (phone) userUpdates.phone = phone;

//     if (Object.keys(userUpdates).length > 0) {
//       await User.findByIdAndUpdate(HARDCODED_USER_ID, userUpdates);
//     }

//     const shopUpdates = {};
//     if (businessAddress) shopUpdates.address = businessAddress;
//     if (phone) shopUpdates.phone = phone;

//     if (Object.keys(shopUpdates).length > 0) {
//       await LaundryShop.findByIdAndUpdate(HARDCODED_SHOP_ID, shopUpdates);
//     }

//     res.status(200).json({ success: true, message: "تم تحديث الملف الشخصي بنجاح" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = { getProfile, updateProfile };




// controllers/provider/profileController.js
const User = require("../../models/userModel");
const LaundryShop = require("../../models/laundryShopModel");
const Order = require("../../models/orderModel");
const mongoose = require("mongoose");

// TODO: remove hardcoded IDs after auth is connected
const HARDCODED_USER_ID = new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaa04");
const HARDCODED_SHOP_ID = new mongoose.Types.ObjectId("dd0000000000000000000002");

/**
 * GET /provider/profile
 */
const getProfile = async (req, res) => {
  try {
    // TODO: replace with req.user and req.shop after auth
    const user = await User.findById(HARDCODED_USER_ID).lean();
    console.log("USER FIELDS:", JSON.stringify(user, null, 2));
    const shop = await LaundryShop.findById(HARDCODED_SHOP_ID);

    if (!user || !shop) {
      return res.status(404).json({ success: false, message: "المستخدم أو المغسلة مش موجود" });
    }

    const orders = await Order.find({ provider: shop._id });
    const done = orders.filter((o) => o.status === "delivered").length;
    const processing = orders.filter((o) =>
      o.status === "in_progress" || o.status === "accepted"
    ).length;

    const userName = user.fullName ?? user.name ?? user.username ?? "";

    res.status(200).json({
      success: true,
      data: {
        name: userName,
        email: user.email,
        phone: user.phone || shop.phone || "",
        role: shop.role || "مدير العمليات",
        businessName: shop.name,
        businessAddress: shop.address || "",
        orderStats: { done, processing },
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /provider/profile
 * Body: { name?, email?, phone?, businessAddress? }
 */
const updateProfile = async (req, res) => {
  try {
    // TODO: replace with req.user._id and req.shop._id after auth
    const { name, email, phone, businessAddress } = req.body;

    const userUpdates = {};
    if (name) {
      userUpdates.fullName = name;
      userUpdates.name = name;
    }
    if (email) userUpdates.email = email;
    if (phone) userUpdates.phone = phone;

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(HARDCODED_USER_ID, userUpdates);
    }

    const shopUpdates = {};
    if (businessAddress) shopUpdates.address = businessAddress;
    if (phone) shopUpdates.phone = phone;

    if (Object.keys(shopUpdates).length > 0) {
      await LaundryShop.findByIdAndUpdate(HARDCODED_SHOP_ID, shopUpdates);
    }

    res.status(200).json({ success: true, message: "تم تحديث الملف الشخصي بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile };