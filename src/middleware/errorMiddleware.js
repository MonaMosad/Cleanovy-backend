 const logger = require("../config/logger");

// ─── Global Error Handler  
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "حدث خطأ في الخادم";

  // ─── Mongoose Validation Error  
  if (err.name === "ValidationError") {
    statusCode = 422;
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(422).json({
      status: "fail",
      message: "بيانات غير صالحة",
      errors,
    });
  }

  // ─── Mongoose Duplicate Key  
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    const fieldNames = { email: "البريد الإلكتروني", phone: "رقم الهاتف" };
    message = `${fieldNames[field] || field} مستخدم بالفعل`;
  }

  // ─── Mongoose Cast Error (bad ID)  
  if (err.name === "CastError") {
    statusCode = 400;
    message = "معرّف غير صالح";
  }

  // ─── JWT Errors  
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "رمز المصادقة غير صالح";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "انتهت صلاحية رمز المصادقة";
  }

  // ─── Log server errors  
  if (statusCode >= 500) {
    logger.error(`❌ [${req.method}] ${req.originalUrl} — ${err.message}`, {
      stack: err.stack,
    });
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// ─── 404 Not Found Handler  
const notFound = (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `المسار غير موجود: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
