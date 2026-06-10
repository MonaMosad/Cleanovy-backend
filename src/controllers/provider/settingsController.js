// controllers/provider/settingsController.js
const LaundryShop = require("../../models/laundryShopModel");
const User = require("../../models/userModel");

/**
 * GET /provider/settings
 * Returns all settings for the Settings page.
 */
const getSettings = async (req, res) => {
  try {
    const user = req.user;
    const shop = req.shop;

    res.status(200).json({
      success: true,
      data: {
        // معلومات المغسلة
        businessName: shop.name,
        businessAddress: shop.address || "",
        phone: user.phone || "",
        email: user.email,

        // ساعات العمل
        openTime: shop.open_time || "08:00",
        closeTime: shop.close_time || "22:00",

        // إعدادات التشغيل
        acceptOrders: shop.accept_orders ?? true,
        fastServiceDefault: shop.fast_service_default ?? true,

        // الإشعارات
        orderAlerts: shop.order_alerts ?? true,
        emailNotifications: shop.email_notifications ?? true,
        smsNotifications: shop.sms_notifications ?? false,

        // اللغة
        language: shop.language || "ar",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /provider/settings
 * Save settings. Splits updates between User and LaundryShop.
 * Body: any subset of the settings object above.
 */
const updateSettings = async (req, res) => {
  try {
    const {
      businessName, businessAddress, phone, email,
      openTime, closeTime,
      acceptOrders, fastServiceDefault,
      orderAlerts, emailNotifications, smsNotifications,
      language,
    } = req.body;

    // User fields
    const userUpdates = {};
    if (phone !== undefined) userUpdates.phone = phone;
    if (email !== undefined) userUpdates.email = email;

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(req.user._id, userUpdates);
    }

    // LaundryShop fields
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

    if (Object.keys(shopUpdates).length > 0) {
      await LaundryShop.findByIdAndUpdate(req.shop._id, shopUpdates);
    }

    res.status(200).json({ success: true, message: "تم حفظ الإعدادات بنجاح" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSettings, updateSettings };