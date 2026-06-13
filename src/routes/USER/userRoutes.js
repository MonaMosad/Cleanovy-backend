// routes/userRoutes.js
import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/profile",  getProfile);
router.put("/profile",  updateProfile);
export default router;
