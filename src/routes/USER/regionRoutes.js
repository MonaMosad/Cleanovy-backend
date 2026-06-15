
// routes/regionRoutes.js

const { Router } = require("express");

const { getRegions, createRegion, deleteRegion ,  getRegionById} = require("../../controllers/USER/regionController.js");

const { protect, restrictTo } = require("../../middleware/authMiddleware.js");



const router = Router();

router.get("/",       getRegions);

router.post("/",      protect, restrictTo("admin"), createRegion);

router.delete("/:id", protect, restrictTo("admin"), deleteRegion);

router.get("/:id",    getRegionById);

module.exports = router; 

