// require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();

const connectDB = require('./config/db');
const e = require('express');

connectDB();

// ── Body & Cookie parsers ─────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// ── Routes ────────────────────────────────────────────────────────────────────


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
// ── Start server ──────────────────────────────────────────────────────────────

