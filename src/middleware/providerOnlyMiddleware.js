// // middleware/providerOnlyMiddleware.js
// const LaundryShop = require("../models/laundryShopModel");

// const providerOnlyMiddleware = async (req, res, next) => {
//   try {
//     if (req.user.role !== "provider") {
//       return res.status(403).json({ success: false, message: "متاح للـ providers بس" });
//     }

//     // Attach the shop to req so controllers don't have to fetch it again
//     const shop = await LaundryShop.findOne({ user: req.user._id });
//     if (!shop) {
//       return res.status(404).json({ success: false, message: "مفيش مغسلة مرتبطة بالحساب ده" });
//     }

//     req.shop = shop;
//     next();
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = providerOnlyMiddleware;



// middleware/providerOnlyMiddleware.js
// const LaundryShop = require("../models/laundryShopModel");

// const providerOnlyMiddleware = async (req, res, next) => {
//   try {
//     const allowedRoles = ["provider", "laundry_owner"];
//     if (!allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({ success: false, message: "متاح للـ providers بس" });
//     }

//     const shop = await LaundryShop.findOne({ user: req.user._id });
//     if (!shop) {
//       return res.status(404).json({
//         success: false,
//         message: "مفيش مغسلة مرتبطة بالحساب ده",
//       });
//     }

//     req.shop = shop;
//     next();
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = providerOnlyMiddleware;

const LaundryShop = require("../models/laundryShopModel");

const providerOnlyMiddleware = async (req, res, next) => {
  try {
    const allowedRoles = ["provider", "laundry_owner"];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "متاح للـ providers بس" });
    }

    const shop = await LaundryShop.findOne({ user: req.user._id });
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "مفيش مغسلة مرتبطة بالحساب ده",
      });
    }

    req.shop = shop;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = providerOnlyMiddleware;