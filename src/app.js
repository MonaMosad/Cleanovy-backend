<<<<<<< HEAD



// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const path = require("path");
// const fs = require("fs");

// const logger = require("./config/logger");
// const passport = require("./config/passport");
// const connectDB = require('./config/db');
// const adminLaundriesRoutes = require("./routes/admin/laundries.routes");
// const adminOrdersRoutes = require("./routes/admin/orders.routes");
// const { errorHandler, notFound } = require("./middleware/errorMiddleware");
// const { apiLimiter } = require("./middleware/rateLimitMiddleware");
// const globalErrorHandler = require("./utils/globalErrorHandler.js");

// // ─── Route imports ──────────────────────────────────────────────────────────
// const authRoutes = require("./routes/authRoutes");
// const profileRoutes = require("./routes/Profileroutes");
// const orderRoutes = require("./routes/orderRoutes.js");
// const reviewRoutes = require("./routes/USER/reviewRoutes.js");
// const serviceRoutes = require("./routes/USER/serviceRoutes.js");
// const addressRoutes = require("./routes/USER/addressRoutes.js");
// const regionRoutes = require("./routes/USER/regionRoutes.js");
// const deliveryRoutes = require("./routes/USER/deliveryRoutes.js");
// const adminRoutes = require("./routes/USER/adminRoutes.js");
// const shopRoutes = require("./routes/USER/shopRoutes.js");
// const userRoutes = require("./routes/USER/userRoutes.js");

// const dashboardRoutes = require('./routes/provider/dashboardRoutes');
// const ordersRoutes = require('./routes/provider/ordersRoutes');
// const adminDashboardRoutes = require("./routes/admin/dashboard.routes");
// const adminUsersRoutes = require("./routes/admin/users.routes");

// const app = express();

// // ─── Ensure uploads directory exists ─────────────────────────────────────────
// const uploadsDir = path.join(__dirname, "..", "uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // ─── Helmet ───────────────────────────────────────────────────────────────────
// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//     crossOriginEmbedderPolicy: false,
//   })
// );

// // ─── CORS Setup ──────────────────────────────────────────────────────────────
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // ─── Body & Cookie Parsers ───────────────────────────────────────────────────
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use(cookieParser());

// // ─── HTTP Logger ─────────────────────────────────────────────────────────────
// if (process.env.NODE_ENV !== "test") {
//   app.use(
//     morgan("combined", {
//       stream: { write: (msg) => logger.info(msg.trim()) },
//     })
//   );
// }

// // ─── Passport ────────────────────────────────────────────────────────────────
// app.use(passport.initialize());

// // ─── Static Files ────────────────────────────────────────────────────────────
// app.use("/uploads", (req, res, next) => {
//   res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
//   next();
// }, express.static(uploadsDir));

// // ─── Global Rate Limit ───────────────────────────────────────────────────────
// app.use(`/api/${process.env.API_VERSION}`, apiLimiter);

// // ─── Health Check ────────────────────────────────────────────────────────────
// app.get("/health", (req, res) => {
//   res.status(200).json({
//     status: "success",
//     message: "Cleanovy API is running",
//     version: process.env.API_VERSION,
//     env: process.env.NODE_ENV,
//     timestamp: new Date().toISOString(),
//   });
// });

// // ─── API Routes ──────────────────────────────────────────────────────────────
// const API_PREFIX = `/api/${process.env.API_VERSION}`;

// app.use("/api/orders", orderRoutes);
// app.use("/api/payments", orderRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/services", serviceRoutes);
// app.use("/api/addresses", addressRoutes);
// app.use("/api/regions", regionRoutes);
// app.use("/api/delivery", deliveryRoutes);
// app.use("/api/shops", shopRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/admin", adminRoutes);

// app.use("/api/admin/dashboard", adminDashboardRoutes);
// app.use("/api/admin/users", adminUsersRoutes);
// //admin landrais
// app.use("/api/admin/laundries", adminLaundriesRoutes);
// //oreders (admin)
// app.use("/api/admin/orders", adminOrdersRoutes);
// // مسارات المشروع الأساسية
// app.use(`${API_PREFIX}/auth`, authRoutes);
// app.use(`${API_PREFIX}/profile`, profileRoutes);

// // ─── Error Handlers ──────────────────────────────────────────────────────────
// app.use(notFound);
// app.use(errorHandler);
// app.use(globalErrorHandler);

// module.exports = app;
=======
>>>>>>> 4f72deb4f5a70e256db8c0a13d39cad6a9cc3d66
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

const logger = require("./config/logger.js");
const passport = require("./config/passport.js");
const { errorHandler, notFound } = require("./middleware/errorMiddleware.js");
const { apiLimiter } = require("./middleware/rateLimitMiddleware.js");
const globalErrorHandler = require("./utils/globalErrorHandler.js");

<<<<<<< HEAD
<<<<<<< HEAD
// ─── Route imports ──────────────────────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/Profileroutes");
=======
// ─── Route imports ───────────────────────────────────────────────────────────
const authRoutes = require("./routes/authRoutes.js");
const profileRoutes = require("./routes/Profileroutes.js");
>>>>>>> 4f72deb4f5a70e256db8c0a13d39cad6a9cc3d66
const orderRoutes = require("./routes/orderRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");

// User Routes
const reviewRoutes = require("./routes/USER/reviewRoutes.js");
const serviceRoutes = require("./routes/USER/serviceRoutes.js");
const addressRoutes = require("./routes/USER/addressRoutes.js");
const regionRoutes = require("./routes/USER/regionRoutes.js");
const deliveryRoutes = require("./routes/USER/deliveryRoutes.js");
const adminRoutes = require("./routes/USER/adminRoutes.js");
const shopRoutes = require("./routes/USER/shopRoutes.js");
const userRoutes = require("./routes/USER/userRoutes.js");

<<<<<<< HEAD
const dashboardRoutes = require('./routes/provider/dashboardRoutes');
const ordersRoutes = require('./routes/provider/ordersRoutes');
const adminReviewsRoutes = require("./routes/admin/reviews.routes");
const adminDashboardRoutes = require("./routes/admin/dashboard.routes");
const adminUsersRoutes = require("./routes/admin/users.routes");
=======
// ─── Route imports ───────────────────────────────────────────────────────────
const authRoutes           = require("./routes/authRoutes.js");
const profileRoutes        = require("./routes/Profileroutes.js");
const orderRoutes          = require("./routes/orderRoutes.js");
const paymentRoutes        = require("./routes/paymentRoutes.js");
const dashboardRoutes      = require("./routes/provider/dashboardRoutes.js");
const ordersRoutes         = require("./routes/provider/ordersRoutes.js");
const adminDashboardRoutes = require("./routes/admin/dashboard.routes.js");
const adminUsersRoutes     = require("./routes/admin/users.routes.js");
>>>>>>> 515fce0 (feat: Refactor order management and add coupon functionality)
=======
// Provider Routes
const dashboardRoutes = require("./routes/provider/dashboardRoutes.js");
const ordersRoutes = require("./routes/provider/ordersRoutes.js");
const servicesRoutes = require("./routes/provider/servicesRoutes.js");
const discountsRoutes = require("./routes/provider/discountsRoutes.js");
const providerProfileRoutes = require("./routes/provider/profileRoutes.js");
const providerSettingsRoutes = require("./routes/provider/settingsRoutes.js");
const reviewsRoutes = require("./routes/provider/reviewsRoutes.js");
const notificationsRoutes = require("./routes/provider/notificationsRoutes.js");

// Admin Routes
const adminDashboardRoutes = require("./routes/admin/dashboard.routes.js");
const adminUsersRoutes = require("./routes/admin/users.routes.js");
const adminReviewsRoutes = require("./routes/admin/reviews.routes.js");
// ملاحظة: تأكد من وجود الملفات التالية في مجلد routes/admin إذا كنت تستخدمها
// const adminLaundriesRoutes = require("./routes/admin/laundries.routes.js");
// const adminOrdersRoutes = require("./routes/admin/orders.routes.js");
>>>>>>> 4f72deb4f5a70e256db8c0a13d39cad6a9cc3d66

const app = express();

// ─── Ensure uploads directory exists ─────────────────────────────────────────
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

<<<<<<< HEAD
<<<<<<< HEAD
// ─── Security ──────────────────────────────────────────────────────────────
=======
// ─── Helmet ──────────────────────────────────────────────────────────────────
>>>>>>> 515fce0 (feat: Refactor order management and add coupon functionality)
=======
// ─── Security (Helmet) ───────────────────────────────────────────────────────
>>>>>>> 4f72deb4f5a70e256db8c0a13d39cad6a9cc3d66
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

<<<<<<< HEAD
// ─── CORS Setup ──────────────────────────────────────────────────────────────
<<<<<<< HEAD



// ─── CORS Setup ──────────────────────────────────────────────────────────────
=======
// ─── CORS ────────────────────────────────────────────────────────────────────
>>>>>>> 515fce0 (feat: Refactor order management and add coupon functionality)
=======
>>>>>>> 4f72deb4f5a70e256db8c0a13d39cad6a9cc3d66
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Body & Cookie Parsers ───────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ─── HTTP Logger ─────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(
    morgan("combined", {
      stream: { write: (msg) => logger.info(msg.trim()) },
    })
  );
}

// ─── Passport ────────────────────────────────────────────────────────────────
app.use(passport.initialize());

<<<<<<< HEAD
<<<<<<< HEAD
// ─── Static Files (uploads) ────────────────────────────────────────────────
=======
// ─── Static Files (uploads) ──────────────────────────────────────────────────
>>>>>>> 4f72deb4f5a70e256db8c0a13d39cad6a9cc3d66
app.use(
  "/uploads",
  (req, res, next) => {
<<<<<<< HEAD
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
=======
// ─── Static Files ────────────────────────────────────────────────────────────
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
>>>>>>> 515fce0 (feat: Refactor order management and add coupon functionality)
=======
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
>>>>>>> 4f72deb4f5a70e256db8c0a13d39cad6a9cc3d66
    next();
  },
  express.static(uploadsDir)
);

<<<<<<< HEAD
<<<<<<< HEAD
// ─── Global Rate Limit ─────────────────────────────────────────────────────
=======
// ─── Global Rate Limit & Prefix ──────────────────────────────────────────────
>>>>>>> 4f72deb4f5a70e256db8c0a13d39cad6a9cc3d66
const API_PREFIX = `/api/${process.env.API_VERSION}`;
app.use(API_PREFIX, apiLimiter);
=======
// ─── Rate Limit ──────────────────────────────────────────────────────────────
app.use(`/api/${process.env.API_VERSION}`, apiLimiter);
>>>>>>> 515fce0 (feat: Refactor order management and add coupon functionality)

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Cleanovy API is running",
    version: process.env.API_VERSION,
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────

<<<<<<< HEAD
<<<<<<< HEAD
=======
// 1. Base User & Order Routes
>>>>>>> 4f72deb4f5a70e256db8c0a13d39cad6a9cc3d66
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/regions", regionRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/users", userRoutes);

// 2. Admin Panel Routes (يجب أن تسجل قبل مسار /api/admin العام لمنع تداخل الـ Middleware)
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/admin/reviews", adminReviewsRoutes);
// لو الملفات دي موجودة فك عنها الكومنت هنا وفي الإستيراد فوق:
// app.use("/api/admin/laundries", adminLaundriesRoutes);
// app.use("/api/admin/orders", adminOrdersRoutes);

// القديم (الحماية بالـ Middleware)
app.use("/api/admin", adminRoutes);

// 3. Core App Routes (Auth & Profile)
app.use(`${API_PREFIX}/auth`, authRoutes);
=======
// Orders & Payments — مسارات مستقلة لكل منهم
app.use("/api/orders",   orderRoutes);
app.use("/api/payments", paymentRoutes);   // ← مفصولين دلوقتي

// Admin
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/users",     adminUsersRoutes);

// Auth & Profile
app.use(`${API_PREFIX}/auth`,    authRoutes);
>>>>>>> 515fce0 (feat: Refactor order management and add coupon functionality)
app.use(`${API_PREFIX}/profile`, profileRoutes);

<<<<<<< HEAD
// Provider
app.use("/api/provider/dashboard", dashboardRoutes);
app.use("/api/provider/orders",    ordersRoutes);

// ─── Error Handlers ──────────────────────────────────────────────────────────
// ─── API Routes ────────────────────────────────────────────────────────────
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/profile`, profileRoutes);
// app.use(`${API_PREFIX}/contact`, contactRequestRoutes);

// ─── Provider Routes ───────────────────────────────────────────────────────
=======
// 4. Provider Routes
>>>>>>> 4f72deb4f5a70e256db8c0a13d39cad6a9cc3d66
app.use(`${API_PREFIX}/provider/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/provider/orders`, ordersRoutes);
app.use(`${API_PREFIX}/provider/services`, servicesRoutes);
app.use(`${API_PREFIX}/provider/discounts`, discountsRoutes);
app.use(`${API_PREFIX}/provider/profile`, providerProfileRoutes);
app.use(`${API_PREFIX}/provider/settings`, providerSettingsRoutes);
app.use(`${API_PREFIX}/provider/reviews`, reviewsRoutes);
app.use(`${API_PREFIX}/provider/notifications`, notificationsRoutes);

// ─── 404 & Error Handlers ──────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);
app.use(globalErrorHandler);

module.exports = app;