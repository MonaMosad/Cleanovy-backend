
const logger = require("./config/logger");
const passport = require("./config/passport");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const { apiLimiter } = require("./middleware/rateLimitMiddleware");
const path = require("path");
const fs = require("fs");

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const orderRoutes = require("./routes/orderRoutes.js");

const app = express();

// CORS setup للسماح للفرونت إند بالتواصل مع الباك إند
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const connectDB = require('./config/db');
const e = require('express');
// import globalErrorHandler from "./utils/globalErrorHandler.js";
const globalErrorHandler = require("./utils/globalErrorHandler.js");
// ─── Route imports  
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

const dashboardRoutes = require('./routes/provider/dashboardRoutes');
const ordersRoutes = require('./routes/provider/ordersRoutes');
// const servicesRoutes = require('./routes/provider/servicesRoutes');
// const discountsRoutes = require('./routes/provider/discountsRoutes');


// ─── Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ─── Helmet - مع السماح للصور تتحمل من الفرونت اند
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

// ── Body & Cookie parsers ─────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/orders", orderRoutes);
app.use("/api/payments",orderRoutes); // نفس الـ orderRoutes بيحتوي على مسارات الدفع كمان);
// ─── CORS
app.use(
  cors({
    origin: true, // السماح لكل الـ origins في development
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Body Parsers 
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── HTTP Logger  
if (process.env.NODE_ENV !== "test") {
  app.use(
    morgan("combined", {
      stream: { write: (msg) => logger.info(msg.trim()) },
    })
  );
}

// ─── Passport  
app.use(passport.initialize());

// ─── Static Files - مع header يسمح بالتحميل من أي origin
app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(uploadsDir));

// ─── Global Rate Limit  
app.use(`/api/${process.env.API_VERSION}`, apiLimiter);

// ─── Health Check  
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Cleanovy API is running",
    version: process.env.API_VERSION,
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});
app.use(globalErrorHandler);

// ─── API Routes   
const API_PREFIX = `/api/${process.env.API_VERSION}`;
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/profile`, profileRoutes);

// ─── 404 & Error Handlers 
app.use(notFound);
app.use(errorHandler);

module.exports = app;