// routes/serviceRoutes.js
import { Router } from "express";
import { getServices, createService, deleteService } from "../controllers/serviceController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
router.get("/",       getServices);
router.post("/",      protect, requireRole("admin"), createService);
router.delete("/:id", protect, requireRole("admin"), deleteService);
export default router;
