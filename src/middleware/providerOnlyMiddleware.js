const LaundryShop = require("../models/laundryShopModel");

const providerOnlyMiddleware = async (req, res, next) => {
  try {
    const allowedRoles = ["provider", "laundry_owner"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "متاح للـ providers بس" });
    }

    let shop = await LaundryShop.findOne({ user: req.user._id });

    if (!shop) {
      shop = await LaundryShop.create({
        user: req.user._id,
        name: `مغسلة ${req.user.fullName || "جديدة"}`,
        address: "",
      });
    }

    req.shop = shop;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = providerOnlyMiddleware;
