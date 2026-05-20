const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("./config/passport");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const { apiLimiter } = require("./middleware/rateLimitMiddleware");
const logger = require("./config/logger");

// ─── Route imports  
const authRoutes = require("./routes/authRoutes");

const app = express();

// ─── Security Middleware  
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
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

// ─── Static Files  
app.use("/uploads", express.static("uploads"));

// ─── Global Rate Limit  
app.use(`/api/${process.env.API_VERSION}`, apiLimiter);

// ─── Health Check  
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Nadif API is running 🚀",
    version: process.env.API_VERSION,
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes   
const API_PREFIX = `/api/${process.env.API_VERSION}`;

app.use(`${API_PREFIX}/auth`, authRoutes);

// ─── 404 & Error Handlers 
app.use(notFound);
app.use(errorHandler);

module.exports = app;
