// <<<<<<< HEAD
// require("dotenv").config();
// const app = require("./app");
// const connectDB = require("./config/db");
// const logger = require("./config/logger");

// const PORT = process.env.PORT || 5000;

// // ─── Start Server 
// const startServer = async () => {
//   try {
//     // Connect to MongoDB
//     await connectDB();

//     const server = app.listen(PORT, () => {
//       logger.info(`
//          claenovy API SERVER             
//    Status  : Running                     
//    Port    : ${PORT}                         
//    Env     : ${process.env.NODE_ENV}         
//    Version : ${process.env.API_VERSION}                  
 
//       `);
//     });

//     // ─── Graceful Shutdown  
//     const shutdown = (signal) => {
//       logger.info(`\n${signal} received. Shutting down gracefully...`);
//       server.close(() => {
//         logger.info("HTTP server closed");
//         process.exit(0);
//       });
//     };

//     process.on("SIGTERM", () => shutdown("SIGTERM"));
//     process.on("SIGINT", () => shutdown("SIGINT"));

//     process.on("unhandledRejection", (err) => {
//       logger.error(`Unhandled Rejection: ${err.message}`);
//       server.close(() => process.exit(1));
//     });

//     process.on("uncaughtException", (err) => {
//       logger.error(`Uncaught Exception: ${err.message}`);
//       process.exit(1);
//     });
//   } catch (error) {
//     logger.error(`Server startup failed: ${error.message}`);
//     process.exit(1);
//   }
// };

// startServer();
// =======
// // server.js
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";

// import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import shopRoutes from "./routes/shopRoutes.js";
// import serviceRoutes from "./routes/serviceRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import reviewRoutes from "./routes/reviewRoutes.js";
// import regionRoutes from "./routes/regionRoutes.js";
// import addressRoutes from "./routes/addressRoutes.js";
// import deliveryRoutes from "./routes/deliveryRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";

// dotenv.config();

// const app = express();

// // ── Middleware ──────────────────────────────────────────────
// app.use(cors());
// app.use(express.json());

// // ── Routes ──────────────────────────────────────────────────
// app.use("/api/auth",      authRoutes);
// app.use("/api/users",     userRoutes);
// app.use("/api/shops",     shopRoutes);
// app.use("/api/services",  serviceRoutes);
// app.use("/api/orders",    orderRoutes);
// app.use("/api/reviews",   reviewRoutes);
// app.use("/api/regions",   regionRoutes);
// app.use("/api/addresses", addressRoutes);
// app.use("/api/delivery",  deliveryRoutes);
// app.use("/api/admin",     adminRoutes);

// // ── Health check ────────────────────────────────────────────
// app.get("/", (req, res) => res.json({ message: "Natheef API running ✅" }));

// // ── 404 handler ─────────────────────────────────────────────
// app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// // ── Error handler ───────────────────────────────────────────
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({ message: err.message || "Internal server error" });
// });

// // ── DB + Listen ─────────────────────────────────────────────
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/natheef";

// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("✅ Connected to MongoDB");
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err.message);
//     process.exit(1);
//   });
// >>>>>>> salmahesham2
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const logger = require("./config/logger");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(`
         claenovy API SERVER
   Status  : Running
   Port    : ${PORT}
   Env     : ${process.env.NODE_ENV}
   Version : ${process.env.API_VERSION}
      `);
    });

    const shutdown = (signal) => {
      logger.info(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (err) => {
      logger.error(`Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    process.on("uncaughtException", (err) => {
      logger.error(`Uncaught Exception: ${err.message}`);
      process.exit(1);
    });
  } catch (error) {
    logger.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
