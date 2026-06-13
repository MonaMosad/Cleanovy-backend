// routes/authRoutes.js
const { Router } = require("express");
const { register, login, me } = require("../../controllers/USER/authController.js");
const { protect } = require("../../middleware/authMiddleware.js");

const router = Router();

router.post("/register", register);
router.post("/login",    login);
router.get("/me",        protect, me);

module.exports = router;
