const rateLimit = require("express-rate-limit");

const isDev = process.env.NODE_ENV !== "production";

// ─── General API Rate Limit
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "طلبات كثيرة جداً. يرجى المحاولة بعد 15 دقيقة",
  },
});

// ─── Auth Rate Limit (stricter)
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "محاولات دخول كثيرة جداً. يرجى المحاولة بعد 15 دقيقة",
  },
  skipSuccessfulRequests: true,
});

// ─── Forgot Password Limit  
exports.forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    status: "fail",
    message: "تم تجاوز الحد المسموح لطلبات إعادة تعيين كلمة المرور. حاول بعد ساعة",
  },
});
