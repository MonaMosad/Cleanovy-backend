// require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const orderRoutes = require("./routes/orderRoutes.js");

const app = express();

// CORS setup للسماح للفرونت إند بالتواصل مع الباك إند
const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const connectDB = require('./config/db');
const e = require('express');
// import globalErrorHandler from "./utils/globalErrorHandler.js";
const globalErrorHandler = require("./utils/globalErrorHandler.js");

connectDB();

// ── Body & Cookie parsers ─────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/orders", orderRoutes);
app.use("/api/payments",orderRoutes); // نفس الـ orderRoutes بيحتوي على مسارات الدفع كمان);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ status: 'fail', message: `Route ${req.originalUrl} not found.` });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
  });
});
app.use(globalErrorHandler);

module.exports = app;
// ── Start server ──────────────────────────────────────────────────────────────

