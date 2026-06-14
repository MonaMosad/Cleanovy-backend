// <<<<<<< HEAD
// // <<<<<<< HEAD

// // const logger = require("./config/logger");
// // const passport = require("./config/passport");

// // const express = require("express");
// // const cors = require("cors");
// // const helmet = require("helmet");
// // const morgan = require("morgan");
// // const { errorHandler, notFound } = require("./middleware/errorMiddleware");
// // const { apiLimiter } = require("./middleware/rateLimitMiddleware");
// // const path = require("path");
// // const fs = require("fs");

// // const mongoose = require('mongoose');
// // const cookieParser = require('cookie-parser');
// // const orderRoutes = require("./routes/orderRoutes.js");

// // const app = express();

// // // CORS setup للسماح للفرونت إند بالتواصل مع الباك إند
// // app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// // const connectDB = require('./config/db');
// // const e = require('express');
// // // import globalErrorHandler from "./utils/globalErrorHandler.js";
// // const globalErrorHandler = require("./utils/globalErrorHandler.js");
// // // ─── Route imports  
// // const authRoutes = require("./routes/authRoutes");
// // const profileRoutes = require("./routes/profileRoutes");

// // const dashboardRoutes = require('./routes/provider/dashboardRoutes');
// // const ordersRoutes = require('./routes/provider/ordersRoutes');
// // // const servicesRoutes = require('./routes/provider/servicesRoutes');
// // // const discountsRoutes = require('./routes/provider/discountsRoutes');


// // // ─── Ensure uploads directory exists
// // const uploadsDir = path.join(__dirname, "..", "uploads");
// // if (!fs.existsSync(uploadsDir)) {
// //   fs.mkdirSync(uploadsDir, { recursive: true });
// // }

// // =======
// // const cors = require("cors");
// // const helmet = require("helmet");
// // const morgan = require("morgan");
// // const passport = require("./config/passport");
// // const { errorHandler, notFound } = require("./middleware/errorMiddleware");
// // const { apiLimiter } = require("./middleware/rateLimitMiddleware");
// // const logger = require("./config/logger");
// // const path = require("path");
// // const fs = require("fs");

// // // ─── Route imports  
// // const authRoutes = require("./routes/authRoutes");
// // const profileRoutes = require("./routes/profileRoutes");

// // const dashboardRoutes = require('./routes/provider/dashboardRoutes');
// // const ordersRoutes = require('./routes/provider/ordersRoutes');
// // // const servicesRoutes = require('./routes/provider/servicesRoutes');
// // // const discountsRoutes = require('./routes/provider/discountsRoutes');

// // const app = express();

// // // ─── Ensure uploads directory exists
// // const uploadsDir = path.join(__dirname, "..", "uploads");
// // if (!fs.existsSync(uploadsDir)) {
// //   fs.mkdirSync(uploadsDir, { recursive: true });
// // }

// // >>>>>>> origin/main
// // // ─── Helmet - مع السماح للصور تتحمل من الفرونت اند
// // app.use(
// //   helmet({
// //     crossOriginResourcePolicy: { policy: "cross-origin" },
// //     crossOriginEmbedderPolicy: false,
// //   })
// // );

// // <<<<<<< HEAD
// // // ── Body & Cookie parsers ─────────────────────────────────────────────────────
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));
// // app.use(cookieParser());
// // // ── Routes ────────────────────────────────────────────────────────────────────
// // app.use("/api/orders", orderRoutes);
// // app.use("/api/payments",orderRoutes); // نفس الـ orderRoutes بيحتوي على مسارات الدفع كمان);
// // =======
// // >>>>>>> origin/main
// // // ─── CORS
// // app.use(
// //   cors({
// //     origin: true, // السماح لكل الـ origins في development
// //     credentials: true,
// //     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
// //     allowedHeaders: ["Content-Type", "Authorization"],
// //   })
// // );
// // <<<<<<< HEAD

// // // ─── Body Parsers 
// // app.use(express.json({ limit: "10mb" }));
// // app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // // ─── HTTP Logger  
// // if (process.env.NODE_ENV !== "test") {
// //   app.use(
// //     morgan("combined", {
// //       stream: { write: (msg) => logger.info(msg.trim()) },
// //     })
// //   );
// // }

// // // ─── Passport  
// // app.use(passport.initialize());

// // // ─── Static Files - مع header يسمح بالتحميل من أي origin
// // app.use("/uploads", (req, res, next) => {
// //   res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
// //   next();
// // }, express.static(uploadsDir));

// // // ─── Global Rate Limit  
// // app.use(`/api/${process.env.API_VERSION}`, apiLimiter);

// // =======

// // // ─── Body Parsers 
// // app.use(express.json({ limit: "10mb" }));
// // app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // // ─── HTTP Logger  
// // if (process.env.NODE_ENV !== "test") {
// //   app.use(
// //     morgan("combined", {
// //       stream: { write: (msg) => logger.info(msg.trim()) },
// //     })
// //   );
// // }

// // // ─── Passport  
// // app.use(passport.initialize());

// // // ─── Static Files - مع header يسمح بالتحميل من أي origin
// // app.use("/uploads", (req, res, next) => {
// //   res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
// //   next();
// // }, express.static(uploadsDir));

// // // ─── Global Rate Limit  
// // app.use(`/api/${process.env.API_VERSION}`, apiLimiter);

// // >>>>>>> origin/main
// // // ─── Health Check  
// // app.get("/health", (req, res) => {
// //   res.status(200).json({
// //     status: "success",
// //     message: "Cleanovy API is running",
// //     version: process.env.API_VERSION,
// //     env: process.env.NODE_ENV,
// //     timestamp: new Date().toISOString(),
// //   });
// // });
// // app.use(globalErrorHandler);

// // // ─── API Routes   
// // const API_PREFIX = `/api/${process.env.API_VERSION}`;
// // app.use(`${API_PREFIX}/auth`, authRoutes);
// // app.use(`${API_PREFIX}/profile`, profileRoutes);

// // // ─── 404 & Error Handlers 
// // app.use(notFound);
// // app.use(errorHandler);

// // module.exports = app;
// const express = require("express");
// const adminDashboardRoutes = require("./routes/admin/dashboard.routes");
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

// const { errorHandler, notFound } = require("./middleware/errorMiddleware");
// const { apiLimiter } = require("./middleware/rateLimitMiddleware");
// const globalErrorHandler = require("./utils/globalErrorHandler.js");

// // ─── Route imports ──────────────────────────────────────────────────────────
// const authRoutes = require("./routes/authRoutes");
// const profileRoutes = require("./routes/profileRoutes");
// const orderRoutes = require("./routes/orderRoutes.js");
// const dashboardRoutes = require('./routes/provider/dashboardRoutes');
// const ordersRoutes = require('./routes/provider/ordersRoutes');

// const adminUsersRoutes = require("./routes/admin/users.routes");
// const app = express();

// // ─── Ensure uploads directory exists ─────────────────────────────────────────
// const uploadsDir = path.join(__dirname, "..", "uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // ─── Helmet - مع السماح للصور تتحمل من الفرونت اند ───────────────────────────────
// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//     crossOriginEmbedderPolicy: false,
//   })
// );

// // ─── CORS Setup ──────────────────────────────────────────────────────────────
// app.use(
//   cors({
//     origin: "http://localhost:5173", // محدد للفرونت إند الخاص بكِ لضمان عمل الـ credentials
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

// // مساراتك الجديدة للطلبات والدفع
// app.use("/api/orders", orderRoutes);
// app.use("/api/payments", orderRoutes); 


// //dashbourd
// app.use("/api/admin/dashboard", adminDashboardRoutes);
// // user (admin)

// app.use("/api/admin/users", adminUsersRoutes);
// // مسارات المشروع الأساسية
// app.use(`${API_PREFIX}/auth`, authRoutes);
// app.use(`${API_PREFIX}/profile`, profileRoutes);



// // ─── Error Handlers ──────────────────────────────────────────────────────────
// app.use(notFound);
// app.use(errorHandler);
// app.use(globalErrorHandler);

// module.exports = app;
// =======
// // import "dotenv/config";
// // import express from "express";
// // import cookieParser from "cookie-parser";
 
// // import connectDB from "./config/db.js";
 
// // import authRoutes     from "./routes/authRoutes.js";
// // import userRoutes     from "./routes/userRoutes.js";
// // import shopRoutes     from "./routes/shopRoutes.js";
// // import orderRoutes    from "./routes/orderRoutes.js";
// // import reviewRoutes   from "./routes/reviewRoutes.js";
// // import serviceRoutes  from "./routes/serviceRoutes.js";
// // import addressRoutes  from "./routes/addressRoutes.js";
// // import regionRoutes   from "./routes/regionRoutes.js";
// // import deliveryRoutes from "./routes/deliveryRoutes.js";
// // import adminRoutes    from "./routes/adminRoutes.js";
 
// // const app = express();
 
// // connectDB();
 
// // // ── Parsers ───────────────────────────────────────────────────────────────────
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));
// // app.use(cookieParser());
 
// // // ── Routes ────────────────────────────────────────────────────────────────────
// // app.use("/api/auth",     authRoutes);
// // app.use("/api/users",    userRoutes);
// // app.use("/api/shops",    shopRoutes);
// // app.use("/api/orders",   orderRoutes);
// // app.use("/api/reviews",  reviewRoutes);
// // app.use("/api/services", serviceRoutes);
// // app.use("/api/addresses",addressRoutes);
// // app.use("/api/regions",  regionRoutes);
// // app.use("/api/delivery", deliveryRoutes);
// // app.use("/api/admin",    adminRoutes);
 
// // // ── 404 ───────────────────────────────────────────────────────────────────────
// // app.use((req, res) => {
// //   res.status(404).json({ status: "fail", message: `Route ${req.originalUrl} not found.` });
// // });
 
// // // ── Global error handler ──────────────────────────────────────────────────────
// // app.use((err, req, res, next) => {
// //   console.error(err.stack);
// //   res.status(err.statusCode || 500).json({
// //     status: "error",
// //     message: err.message || "Internal server error",
// //   });
// // });
 
// // // ── Start ─────────────────────────────────────────────────────────────────────
// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
//  import "dotenv/config";
// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
 
// import connectDB from "./config/db.js";
 
// import authRoutes     from "./routes/authRoutes.js";
// import userRoutes     from "./routes/userRoutes.js";
// import shopRoutes     from "./routes/shopRoutes.js";
// import orderRoutes    from "./routes/orderRoutes.js";
// import reviewRoutes   from "./routes/reviewRoutes.js";
// import serviceRoutes  from "./routes/serviceRoutes.js";
// import addressRoutes  from "./routes/addressRoutes.js";
// import regionRoutes   from "./routes/regionRoutes.js";
// import deliveryRoutes from "./routes/deliveryRoutes.js";
// import adminRoutes    from "./routes/adminRoutes.js";
 
// const app = express();
// connectDB();
 
// // ── CORS ──────────────────────────────────────────────────────────────────────
// app.use(cors({ origin: "*", credentials: true }));
 
// // ── Parsers ───────────────────────────────────────────────────────────────────
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
 
// // ── Routes ────────────────────────────────────────────────────────────────────
// app.use("/api/auth",      authRoutes);
// app.use("/api/users",     userRoutes);
// app.use("/api/shops",     shopRoutes);
// app.use("/api/orders",    orderRoutes);
// app.use("/api/reviews",   reviewRoutes);
// app.use("/api/services",  serviceRoutes);
// app.use("/api/addresses", addressRoutes);
// app.use("/api/regions",   regionRoutes);
// app.use("/api/delivery",  deliveryRoutes);
// app.use("/api/admin",     adminRoutes);
 
// // ── 404 ───────────────────────────────────────────────────────────────────────
// app.use((req, res) => {
//   res.status(404).json({ status: "fail", message: `Route ${req.originalUrl} not found.` });
// });
 
// // ── Global error handler ──────────────────────────────────────────────────────
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.statusCode || 500).json({
//     status: "error",
//     message: err.message || "Internal server error",
//   });
// });
 
// // ── Start ─────────────────────────────────────────────────────────────────────
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
// >>>>>>> salmahesham2


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

// ─── Route imports ───────────────────────────────────────────────────────────
const authRoutes           = require("./routes/authRoutes.js");
const profileRoutes        = require("./routes/Profileroutes.js");
const orderRoutes          = require("./routes/orderRoutes.js");
const paymentRoutes        = require("./routes/paymentRoutes.js");
const dashboardRoutes      = require("./routes/provider/dashboardRoutes.js");
const ordersRoutes         = require("./routes/provider/ordersRoutes.js");
const adminDashboardRoutes = require("./routes/admin/dashboard.routes.js");
const adminUsersRoutes     = require("./routes/admin/users.routes.js");

const app = express();

// ─── Ensure uploads directory exists ─────────────────────────────────────────
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ─── Helmet ──────────────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

// ─── CORS ────────────────────────────────────────────────────────────────────
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

// ─── Static Files ────────────────────────────────────────────────────────────
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(uploadsDir)
);

// ─── Rate Limit ──────────────────────────────────────────────────────────────
app.use(`/api/${process.env.API_VERSION}`, apiLimiter);

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
const API_PREFIX = `/api/${process.env.API_VERSION}`;

// Orders & Payments — مسارات مستقلة لكل منهم
app.use("/api/orders",   orderRoutes);
app.use("/api/payments", paymentRoutes);   // ← مفصولين دلوقتي

// Admin
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/users",     adminUsersRoutes);

// Auth & Profile
app.use(`${API_PREFIX}/auth`,    authRoutes);
app.use(`${API_PREFIX}/profile`, profileRoutes);

// Provider
app.use("/api/provider/dashboard", dashboardRoutes);
app.use("/api/provider/orders",    ordersRoutes);

// ─── Error Handlers ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);
app.use(globalErrorHandler);

module.exports = app;