const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// ─── Generate Access Token  
const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// ─── Generate Refresh Token ة
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  });
};

// ─── Verify Access Token  
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// ─── Verify Refresh Token  
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

// ─── Generate Random Token (for email/reset)  
const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// ─── Hash Token (before storing in DB)  
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateRandomToken,
  hashToken,
};



