// routes/userRoutes.js
const { Router } = require("express");
const { getProfile, updateProfile } = require("../../controllers/USER/userController.js");
const { protect } = require("../../middleware/authMiddleware.js");

const router = Router();
router.use(protect);
router.get("/profile",  getProfile);
router.put("/profile",  updateProfile);
module.exports = router;
