

// const express = require('express');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');

// const authRoutes = require('./routes/authRoutes');
// const dashboardRoutes = require('./routes/provider/dashboardRoutes');
// const ordersRoutes = require('./routes/provider/ordersRoutes');
// const servicesRoutes = require('./routes/provider/servicesRoutes');
// const discountsRoutes = require('./routes/provider/discountsRoutes');
// const providerProfileRoutes = require('./routes/provider/profileRoutes');
// const providerSettingsRoutes = require('./routes/provider/settingsRoutes');
// const reviewsRoutes = require('./routes/provider/reviewsRoutes');
// const notificationsRoutes = require('./routes/provider/notificationsRoutes');

// const app = express();
// const connectDB = require('./config/db');
// connectDB();

// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
//   credentials: true,
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // ── Auth Routes ───────────────────────────────────────────────────────────────
// app.use("/api/v1/auth", authRoutes);







// const helmet = require("helmet");
// const morgan = require("morgan");
// const passport = require("./config/passport");
// const { errorHandler, notFound } = require("./middleware/errorMiddleware");
// const { apiLimiter } = require("./middleware/rateLimitMiddleware");
// const logger = require("./config/logger");
// const path = require("path");
// const fs = require("fs");
// const contactRequestRoutes = require('./routes/contactUsRoutes'); 

// // ─── Route imports  

// const profileRoutes = require("./routes/profileRoutes");

// const app = express();

// // ─── Ensure uploads directory exists
// const uploadsDir = path.join(__dirname, "..", "uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // ─── Helmet - مع السماح للصور تتحمل من الفرونت اند
// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//     crossOriginEmbedderPolicy: false,
//   })
// );

// // ─── CORS
// app.use(
//   cors({
//     origin: true, // السماح لكل الـ origins في development
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // ─── Body Parsers 
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // ─── HTTP Logger  
// if (process.env.NODE_ENV !== "test") {
//   app.use(
//     morgan("combined", {
//       stream: { write: (msg) => logger.info(msg.trim()) },
//     })
//   );
// }

// // ─── Passport  
// app.use(passport.initialize());

// // ─── Static Files - مع header يسمح بالتحميل من أي origin
// app.use("/uploads", (req, res, next) => {
//   res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
//   next();
// }, express.static(uploadsDir));

// // ─── Global Rate Limit  
// app.use(`/api/${process.env.API_VERSION}`, apiLimiter);

// // ─── Health Check  
// app.get("/health", (req, res) => {
//   res.status(200).json({
//     status: "success",
//     message: "Cleanovy API is running",
//     version: process.env.API_VERSION,
//     env: process.env.NODE_ENV,
//     timestamp: new Date().toISOString(),
//   });
// });

// // ─── API Routes   
// const API_PREFIX = `/api/${process.env.API_VERSION}`;
// app.use(`${API_PREFIX}/auth`, authRoutes);
// app.use(`${API_PREFIX}/profile`, profileRoutes);
// app.use(`${API_PREFIX}/contact`, contactRequestRoutes);
// //app.use('/api/contact', contactRequestRoutes); 




// // ── Provider Routes ───────────────────────────────────────────────────────────
// app.use("/api/v1/provider/dashboard", dashboardRoutes);
// app.use("/api/v1/provider/orders", ordersRoutes);
// app.use("/api/v1/provider/services", servicesRoutes);
// app.use("/api/v1/provider/discounts", discountsRoutes);
// app.use("/api/v1/provider/profile", providerProfileRoutes);
// app.use("/api/v1/provider/settings", providerSettingsRoutes);
// app.use("/api/v1/provider/reviews", reviewsRoutes);
// app.use("/api/v1/provider/notifications", notificationsRoutes);









// // ─── 404 & Error Handlers 
// app.use(notFound);
// app.use(errorHandler);

// module.exports = app;






// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const path = require('path');
// const fs = require('fs');

// const passport = require('./config/passport');
// const connectDB = require('./config/db');
// const logger = require('./config/logger');
// const { errorHandler, notFound } = require('./middleware/errorMiddleware');
// const { apiLimiter } = require('./middleware/rateLimitMiddleware');

// // ─── Route imports ──────────────────────────────────────────────────────────
// const authRoutes = require('./routes/authRoutes');
// const profileRoutes = require('./routes/profileRoutes');
// const contactRequestRoutes = require('./routes/contactUsRoutes');

// const dashboardRoutes = require('./routes/provider/dashboardRoutes');
// const ordersRoutes = require('./routes/provider/ordersRoutes');
// const servicesRoutes = require('./routes/provider/servicesRoutes');
// const discountsRoutes = require('./routes/provider/discountsRoutes');
// const providerProfileRoutes = require('./routes/provider/profileRoutes');
// const providerSettingsRoutes = require('./routes/provider/settingsRoutes');
// const reviewsRoutes = require('./routes/provider/reviewsRoutes');
// const notificationsRoutes = require('./routes/provider/notificationsRoutes');

// const app = express();
// connectDB();

// // ─── Ensure uploads directory exists ──────────────────────────────────────
// const uploadsDir = path.join(__dirname, '..', 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // ─── Security ──────────────────────────────────────────────────────────────
// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: 'cross-origin' },
//     crossOriginEmbedderPolicy: false,
//   })
// );

// // ─── CORS ──────────────────────────────────────────────────────────────────
// app.use(
//   cors({
//     origin: true, // allow all origins in development
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

// // ─── Body Parsers ──────────────────────────────────────────────────────────
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(cookieParser());

// // ─── HTTP Logger ───────────────────────────────────────────────────────────
// if (process.env.NODE_ENV !== 'test') {
//   app.use(
//     morgan('combined', {
//       stream: { write: (msg) => logger.info(msg.trim()) },
//     })
//   );
// }

// // ─── Passport ──────────────────────────────────────────────────────────────
// app.use(passport.initialize());

// // ─── Static Files (uploads) ────────────────────────────────────────────────
// app.use(
//   '/uploads',
//   (req, res, next) => {
//     res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
//     next();
//   },
//   express.static(uploadsDir)
// );

// // ─── Global Rate Limit ─────────────────────────────────────────────────────
// const API_PREFIX = `/api/${process.env.API_VERSION}`;
// app.use(API_PREFIX, apiLimiter);

// // ─── Health Check ──────────────────────────────────────────────────────────
// app.get('/health', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Cleanovy API is running',
//     version: process.env.API_VERSION,
//     env: process.env.NODE_ENV,
//     timestamp: new Date().toISOString(),
//   });
// });

// // ─── API Routes ────────────────────────────────────────────────────────────
// app.use(`${API_PREFIX}/auth`, authRoutes);
// app.use(`${API_PREFIX}/profile`, profileRoutes);
// app.use(`${API_PREFIX}/contact`, contactRequestRoutes);

// // ─── Provider Routes ───────────────────────────────────────────────────────
// app.use(`${API_PREFIX}/provider/dashboard`, dashboardRoutes);
// app.use(`${API_PREFIX}/provider/orders`, ordersRoutes);
// app.use(`${API_PREFIX}/provider/services`, servicesRoutes);
// app.use(`${API_PREFIX}/provider/discounts`, discountsRoutes);
// app.use(`${API_PREFIX}/provider/profile`, providerProfileRoutes);
// app.use(`${API_PREFIX}/provider/settings`, providerSettingsRoutes);
// app.use(`${API_PREFIX}/provider/reviews`, reviewsRoutes);
// app.use(`${API_PREFIX}/provider/notifications`, notificationsRoutes);

// // ─── 404 & Error Handlers ──────────────────────────────────────────────────
// app.use(notFound);
// app.use(errorHandler);

// module.exports = app;





const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const passport = require('./config/passport');
const logger = require('./config/logger');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimitMiddleware');

// ─── Route imports ──────────────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const contactRequestRoutes = require('./routes/contactUsRoutes');

const dashboardRoutes = require('./routes/provider/dashboardRoutes');
const ordersRoutes = require('./routes/provider/ordersRoutes');
const servicesRoutes = require('./routes/provider/servicesRoutes');
const discountsRoutes = require('./routes/provider/discountsRoutes');
const providerProfileRoutes = require('./routes/provider/profileRoutes');
const providerSettingsRoutes = require('./routes/provider/settingsRoutes');
const reviewsRoutes = require('./routes/provider/reviewsRoutes');
const notificationsRoutes = require('./routes/provider/notificationsRoutes');

const app = express();

// ─── Ensure uploads directory exists ──────────────────────────────────────
const uploadsDir = path.join(__dirname, '..', 'uploads');
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

// ─── CORS ──────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: true, // allow all origins in development
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

// ─── API Routes ────────────────────────────────────────────────────────────
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/profile`, profileRoutes);
app.use(`${API_PREFIX}/contact`, contactRequestRoutes);

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

module.exports = app;