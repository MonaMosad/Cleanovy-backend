


const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require("path");
const fs = require("fs");

const logger = require("./config/logger");
const passport = require("./config/passport");
const connectDB = require('./config/db');
const adminLaundriesRoutes = require("./routes/admin/laundries.routes");
const adminOrdersRoutes = require("./routes/admin/orders.routes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const { apiLimiter } = require("./middleware/rateLimitMiddleware");
const globalErrorHandler = require("./utils/globalErrorHandler.js");

// ─── Route imports ──────────────────────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/Profileroutes");
const orderRoutes = require("./routes/orderRoutes.js");
const reviewRoutes = require("./routes/USER/reviewRoutes.js");
const serviceRoutes = require("./routes/USER/serviceRoutes.js");
const addressRoutes = require("./routes/USER/addressRoutes.js");
const regionRoutes = require("./routes/USER/regionRoutes.js");
const deliveryRoutes = require("./routes/USER/deliveryRoutes.js");
const adminRoutes = require("./routes/USER/adminRoutes.js");
const shopRoutes = require("./routes/USER/shopRoutes.js");
const userRoutes = require("./routes/USER/userRoutes.js");
// const contactRequestRoutes = require("./routes/USER/contactRequestRoutes.js");

const dashboardRoutes = require('./routes/provider/dashboardRoutes');
const ordersRoutes = require('./routes/provider/ordersRoutes');
const adminReviewsRoutes = require("./routes/admin/reviews.routes");
const adminDashboardRoutes = require("./routes/admin/dashboard.routes");
const adminUsersRoutes = require("./routes/admin/users.routes");
const shopPageRoutes = require("./routes/USER/shopPageRoutes");
const contactRoutes = require("./routes/contactRoutes");

const servicesRoutes = require('./routes/provider/servicesRoutes');
const discountsRoutes = require('./routes/provider/discountsRoutes');
const providerProfileRoutes = require('./routes/provider/profileRoutes');
const providerSettingsRoutes = require('./routes/provider/settingsRoutes');
const reviewsRoutes = require('./routes/provider/reviewsRoutes');
const notificationsRoutes = require('./routes/provider/notificationsRoutes');
const app = express();

// ─── Ensure uploads directory exists ─────────────────────────────────────────
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ─── Security ──────────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
  })
);

// ─── CORS Setup ──────────────────────────────────────────────────────────────



// ─── CORS Setup ──────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body Parsers ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── HTTP Logger ───────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: { write: (msg) => logger.info(msg.trim()) },
    })
  );
}

// ─── Passport ──────────────────────────────────────────────────────────────
app.use(passport.initialize());

// ─── Static Files (uploads) ────────────────────────────────────────────────
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(uploadsDir)
);

// ─── Global Rate Limit ─────────────────────────────────────────────────────
const API_PREFIX = `/api/${process.env.API_VERSION}`;
app.use(API_PREFIX, apiLimiter);

// ─── Health Check ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Cleanovy API is running',
    version: process.env.API_VERSION,
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
// const API_PREFIX = `/api/${process.env.API_VERSION}`;

app.use("/api/orders", orderRoutes);
app.use("/api/payments", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/regions", regionRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/users", userRoutes);
// ─── User-facing shop page routes ────────────────────────────────────────────
app.use("/api/page", shopPageRoutes);
app.use("/api/contact", contactRoutes);

// ─── Admin Panel routes (no auth) — must be registered BEFORE /api/admin ─────
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/admin/laundries", adminLaundriesRoutes);
app.use("/api/admin/orders", adminOrdersRoutes);
app.use("/api/admin/reviews", adminReviewsRoutes);
// ─── Old admin route (has protect + restrictTo middleware) ────────────────────
app.use("/api/admin", adminRoutes);
// مسارات المشروع الأساسية
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/profile`, profileRoutes);

// ─── Error Handlers ──────────────────────────────────────────────────────────
// ─── API Routes ────────────────────────────────────────────────────────────
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/profile`, profileRoutes);
// app.use(`${API_PREFIX}/contact`, contactRequestRoutes);

// ─── Provider Routes ───────────────────────────────────────────────────────
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
