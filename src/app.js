// import "dotenv/config";
// import express from "express";
// import cookieParser from "cookie-parser";
 
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
 
// // ── Parsers ───────────────────────────────────────────────────────────────────
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
 
// // ── Routes ────────────────────────────────────────────────────────────────────
// app.use("/api/auth",     authRoutes);
// app.use("/api/users",    userRoutes);
// app.use("/api/shops",    shopRoutes);
// app.use("/api/orders",   orderRoutes);
// app.use("/api/reviews",  reviewRoutes);
// app.use("/api/services", serviceRoutes);
// app.use("/api/addresses",addressRoutes);
// app.use("/api/regions",  regionRoutes);
// app.use("/api/delivery", deliveryRoutes);
// app.use("/api/admin",    adminRoutes);
 
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
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
 import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
 
import connectDB from "./config/db.js";
 
import authRoutes     from "./routes/authRoutes.js";
import userRoutes     from "./routes/userRoutes.js";
import shopRoutes     from "./routes/shopRoutes.js";
import orderRoutes    from "./routes/orderRoutes.js";
import reviewRoutes   from "./routes/reviewRoutes.js";
import serviceRoutes  from "./routes/serviceRoutes.js";
import addressRoutes  from "./routes/addressRoutes.js";
import regionRoutes   from "./routes/regionRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import adminRoutes    from "./routes/adminRoutes.js";
 
const app = express();
connectDB();
 
// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({ origin: "*", credentials: true }));
 
// ── Parsers ───────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
 
// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/users",     userRoutes);
app.use("/api/shops",     shopRoutes);
app.use("/api/orders",    orderRoutes);
app.use("/api/reviews",   reviewRoutes);
app.use("/api/services",  serviceRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/regions",   regionRoutes);
app.use("/api/delivery",  deliveryRoutes);
app.use("/api/admin",     adminRoutes);
 
// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ status: "fail", message: `Route ${req.originalUrl} not found.` });
});
 
// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});
 
// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));