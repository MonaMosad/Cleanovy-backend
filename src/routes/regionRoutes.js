
// routes/regionRoutes.js

import { Router } from "express";

import { getRegions, createRegion, deleteRegion ,  getRegionById} from "../controllers/regionController.js";

import { protect, requireRole } from "../middleware/auth.js";



const router = Router();

router.get("/",       getRegions);

router.post("/",      protect, requireRole("admin"), createRegion);

router.delete("/:id", protect, requireRole("admin"), deleteRegion);

router.get("/:id",    getRegionById);

export default router; 

