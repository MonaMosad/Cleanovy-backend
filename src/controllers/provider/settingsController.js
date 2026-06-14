



// // controllers/provider/settingsController.js
// const LaundryShop = require("../../models/laundryShopModel");
// const User = require("../../models/userModel");
// const mongoose = require("mongoose");

// // TODO: remove hardcoded IDs after auth is connected
// const HARDCODED_USER_ID = new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaa04");
// const HARDCODED_SHOP_ID = new mongoose.Types.ObjectId("dd0000000000000000000002");

// /**
//  * GET /provider/settings
//  */
// const getSettings = async (req, res) => {
//   try {
//     // TODO: replace with req.user and req.shop after auth
//     const user = await User.findById(HARDCODED_USER_ID);
//     const shop = await LaundryShop.findById(HARDCODED_SHOP_ID);

//     if (!user || !shop) {
//       return res.status(404).json({ success: false, message: "مش موجود" });
//     }

//     res.status(200).json({
//       success: true,
//       data: {
//         businessName: shop.name,
//         businessAddress: shop.address || "",
//         phone: user.phone || shop.phone || "",
//         email: user.email,
//         openTime: shop.open_time || "08:00",
//         closeTime: shop.close_time || "22:00",
//         acceptOrders: shop.accept_orders ?? true,
//         fastServiceDefault: shop.fast_service_default ?? true,
//         orderAlerts: shop.order_alerts ?? true,
//         emailNotifications: shop.email_notifications ?? true,
//         smsNotifications: shop.sms_notifications ?? false,
//         language: shop.language || "ar",
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * PATCH /provider/settings
//  */
// const updateSettings = async (req, res) => {
//   try {
//     // TODO: replace with req.user._id and req.shop._id after auth
//     const {
//       businessName, businessAddress, phone, email,
//       openTime, closeTime,
//       acceptOrders, fastServiceDefault,
//       orderAlerts, emailNotifications, smsNotifications,
//       language,
//     } = req.body;

//     const userUpdates = {};
//     if (phone !== undefined) userUpdates.phone = phone;
//     if (email !== undefined) userUpdates.email = email;

//     if (Object.keys(userUpdates).length > 0) {
//       await User.findByIdAndUpdate(HARDCODED_USER_ID, userUpdates);
//     }

//     const shopUpdates = {};
//     if (businessName !== undefined) shopUpdates.name = businessName;
//     if (businessAddress !== undefined) shopUpdates.address = businessAddress;
//     if (openTime !== undefined) shopUpdates.open_time = openTime;
//     if (closeTime !== undefined) shopUpdates.close_time = closeTime;
//     if (acceptOrders !== undefined) shopUpdates.accept_orders = acceptOrders;
//     if (fastServiceDefault !== undefined) shopUpdates.fast_service_default = fastServiceDefault;
//     if (orderAlerts !== undefined) shopUpdates.order_alerts = orderAlerts;
//     if (emailNotifications !== undefined) shopUpdates.email_notifications = emailNotifications;
//     if (smsNotifications !== undefined) shopUpdates.sms_notifications = smsNotifications;
//     if (language !== undefined) shopUpdates.language = language;

//     if (Object.keys(shopUpdates).length > 0) {
//       await LaundryShop.findByIdAndUpdate(HARDCODED_SHOP_ID, shopUpdates);
//     }

//     res.status(200).json({ success: true, message: "تم حفظ الإعدادات بنجاح" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = { getSettings, updateSettings };




const LaundryShop = require("../../models/laundryShopModel");
const User = require("../../models/userModel");

const getSettings = async (req, res) => {
  try {
    const user = req.user;
    const shop = req.shop;

    res.status(200).json({
      success: true,
      data: {
        businessName: shop.name,
        businessAddress: shop.address || "",
        phone: user.phone || shop.phone || "",
        email: user.email,
        openTime: shop.open_time || "08:00",
        closeTime: shop.close_time || "22:00",
        acceptOrders: shop.accept_orders ?? true,
        fastServiceDefault: shop.fast_service_default ?? true,
        orderAlerts: shop.order_alerts ?? true,
        emailNotifications: shop.email_notifications ?? true,
        smsNotifications: shop.sms_notifications ?? false,
        language: shop.language || "ar",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const {
      businessName, businessAddress, phone, email,
      openTime, closeTime, acceptOrders, fastServiceDefault,
      orderAlerts, emailNotifications, smsNotifications, language,
    } = req.body;

    const userUpdates = {};
    if (phone !== undefined) userUpdates.phone = phone;
    if (email !== undefined) userUpdates.email = email;
    if (Object.keys(userUpdates).length > 0) await User.findByIdAndUpdate(req.user._id, userUpdates);

    const shopUpdates = {};
    if (businessName !== undefined) shopUpdates.name = businessName;
    if (businessAddress !== undefined) shopUpdates.address = businessAddress;
    if (openTime !== undefined) shopUpdates.open_time = openTime;
    if (closeTime !== undefined) shopUpdates.close_time = closeTime;
    if (acceptOrders !== undefined) shopUpdates.accept_orders = acceptOrders;
    if (fastServiceDefault !== undefined) shopUpdates.fast_service_default = fastServiceDefault;
    if (orderAlerts !== undefined) shopUpdates.order_alerts = orderAlerts;
    if (emailNotifications !== undefined) shopUpdates.email_notifications = emailNotifications;
    if (smsNotifications !== undefined) shopUpdates.sms_notifications = smsNotifications;
    if (language !== undefined) shopUpdates.language = language;
    if (Object.keys(shopUpdates).length > 0) await LaundryShop.findByIdAndUpdate(req.shop._id, shopUpdates);

    res.status(200).json({ success: true, message: "تم حفظ الإعدادات بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSettings, updateSettings };