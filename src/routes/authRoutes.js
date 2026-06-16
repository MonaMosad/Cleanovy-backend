const express = require("express");
const router = express.Router();
const passport = require("../config/passport");

const {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  changePassword,
  googleCallback,
  facebookCallback,
  createLaundryShop,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
} = require("../middleware/validationMiddleware");

// ─── Public Routes 
// Register & Login
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh-token", refreshToken);

// Email Verification
router.get("/verify-email/:token", verifyEmail);

// Password Recovery
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password/:token", validateResetPassword, resetPassword);

// ─── Google OAuth  
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleCallback
);

//  Facebook OAuth  
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"], session: false })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect: "/login" }),
  facebookCallback
);
// ─── Protected Routes
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.post("/change-password", protect, validateChangePassword, changePassword);

// ─── Laundry Shop (for laundry_owner role)
router.post("/laundry-shop", protect, createLaundryShop);

module.exports = router;