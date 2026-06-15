const { verifyAccessToken } = require("../utils/jwt");
const User = require("../models/userModel");
const logger = require("../config/logger");

// ─── Protect: Verify JWT & attach user  
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "غير مصرح. يرجى تسجيل الدخول أولاً",
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Check user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "المستخدم غير موجود",
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        status: "fail",
        message: "تم حظر هذا الحساب",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error(`Auth protect error: ${error.message}`);
    return res.status(401).json({
      status: "fail",
      message: "رمز المصادقة غير صالح أو منتهي الصلاحية",
    });
  }
};

// ─── Restrict: Role-based access  
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "ليس لديك صلاحية للوصول إلى هذا المورد",
      });
    }
    next();
  };
};

/** Allows laundry_owner (canonical) and legacy provider role */
exports.restrictToProvider = (req, res, next) => {
  const allowed = ["provider", "laundry_owner"];
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({
      status: "fail",
      message: "ليس لديك صلاحية للوصول إلى هذا المورد",
    });
  }
  next();
};

// ─── Optional Auth: attach user if token present 
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id);
      if (user && !user.isBanned) {
        req.user = user;
      }
    }
    next();
  } catch {
    next(); // silently ignore if token invalid
  }
};
