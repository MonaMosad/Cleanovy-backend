

// require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const dashboardRoutes = require('./routes/provider/dashboardRoutes');
const ordersRoutes = require('./routes/provider/ordersRoutes');
const servicesRoutes = require('./routes/provider/servicesRoutes');
const discountsRoutes = require('./routes/provider/discountsRoutes');

const app = express();

const connectDB = require('./config/db');
const e = require('express');

connectDB();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true,
}));

// ── Body & Cookie parsers ─────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// ── Routes ────────────────────────────────────────────────────────────────────
//  mounting routes for provider
app.use("/api/v1/provider/dashboard", dashboardRoutes);
app.use("/api/v1/provider/orders", ordersRoutes);
app.use("/api/v1/provider/services", servicesRoutes);
app.use("/api/v1/provider/discounts", discountsRoutes);










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






module.exports = app;