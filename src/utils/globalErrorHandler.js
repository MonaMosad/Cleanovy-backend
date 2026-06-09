// src/utils/globalErrorHandler.js

/**
 * globalErrorHandler — الـ Middleware اللي بيمسك كل الأخطاء
 *
 * لازم يتحط في app.js بعد كل الـ Routes:
 *
 *   const globalErrorHandler = require("./utils/globalErrorHandler.js");
 *   app.use(globalErrorHandler);   ← آخر حاجة في الـ app
 *
 * Express بيعرف إن الـ Middleware ده Error Handler
 * لأن عنده 4 parameters: (err, req, res, next)
 */

// import AppError from "./AppError.js";
const AppError = require("./AppError.js");
// ── معالجة أخطاء MongoDB المحددة ────────────────────────────

// خطأ: ID بصيغة غلط (مش ObjectId صحيح)
const handleCastErrorDB = (err) => {
  const message = `القيمة "${err.value}" غير صالحة للحقل: ${err.path}`;
  return new AppError(message, 400);
};

// خطأ: قيمة مكررة في حقل Unique (مثل: email موجود مسبقاً)
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `القيمة "${value}" مستخدمة مسبقاً في حقل "${field}". يرجى استخدام قيمة أخرى`;
  return new AppError(message, 400);
};

// خطأ: بيانات لا تطابق الـ Schema (مثل: rating = 10 وأقصى قيمة 5)
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `بيانات غير صحيحة: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// ── الرد في بيئة التطوير (تفاصيل كاملة) ────────────────────
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success:    false,
    status:     err.status,
    message:    err.message,
    stack:      err.stack,       // ← مفيدة جداً وقت الـ Debug
    error:      err,
  });
};

// ── الرد في بيئة الإنتاج (معلومات محدودة للأمان) ────────────
const sendErrorProd = (err, res) => {
  // Operational Error → خطأ متوقع → ابعت رسالة واضحة
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Programming Error → bug في الكود → متبعتش التفاصيل للعميل
  console.error("💥 UNEXPECTED ERROR:", err);
  return res.status(500).json({
    success: false,
    message: "حدث خطأ في الخادم، يرجى المحاولة لاحقاً",
  });
};

// ── الـ Global Error Handler الرئيسي ─────────────────────────
const globalErrorHandler = (err, req, res, next) => {
  // قيم افتراضية لو مش موجودة
  err.statusCode = err.statusCode || 500;
  err.status     = err.status     || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    // نعمل نسخة من الـ error عشان منعدلش الـ original
    let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
    error.message = err.message;

    // تحويل أخطاء Mongoose لـ AppError مفهومة
    if (err.name === "CastError")             error = handleCastErrorDB(error);
    if (err.code === 11000)                   error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError")       error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;