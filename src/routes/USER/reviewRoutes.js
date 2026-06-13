// routes/reviewRoutes.js
import { Router } from "express";
import { createReview, getShopReviews, deleteReview } from "../controllers/reviewController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
router.get("/shop/:shopId",  getShopReviews);
router.post("/",             protect, requireRole("client"), createReview);
router.delete("/:id",        protect, requireRole("admin"),  deleteReview);
export default router;
