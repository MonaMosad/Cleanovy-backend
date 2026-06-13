// routes/serviceRoutes.js
const { Router } = require("express");
const { getServices, createService, deleteService } = require("../../controllers/USER/serviceController.js");
const { protect, restrictTo } = require("../../middleware/authMiddleware.js");

const router = Router();
router.get("/",       getServices);
router.post("/",      protect, restrictTo("admin"), createService);
router.delete("/:id", protect, restrictTo("admin"), deleteService);
module.exports = router;
