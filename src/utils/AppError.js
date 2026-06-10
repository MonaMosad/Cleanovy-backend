// src/utils/AppError.js

/**
 * AppError — كلاس الأخطاء المخصصة للتطبيق
 *
 * الفكرة:
 *   Express عنده Global Error Handler بيمسك أي error بيجيله.
 *   لو الـ error عنده خاصية isOperational = true
 *   → ده error متوقع (مثل: بيانات غلط، مش موجود)
 *   → نرد على العميل برسالة واضحة
 *
 *   لو isOperational = false (أو مش موجودة)
 *   → ده crash غير متوقع في السيستم
 *   → منبعتش تفاصيل للعميل (أمان)
 *
 * الاستخدام:
 *   return next(new AppError("الطلب غير موجود", 404));
 *   return next(new AppError("بيانات غير صحيحة", 400));
 */

class AppError extends Error {
  constructor(message, statusCode) {
    // نستدعي constructor الـ parent class (Error)
    // ونمرر الـ message عشان تتحفظ في this.message
    super(message);

    this.statusCode = statusCode;

    // 4xx → fail (خطأ من العميل)
    // 5xx → error (خطأ في السيستم)
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // علامة إن الـ error ده متوقع ومقصود (Operational)
    // مش bug في الكود
    this.isOperational = true;

    // بنحفظ الـ stack trace بس من غير constructor نفسه
    // عشان الـ stack يكون أنظف في الـ logs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;