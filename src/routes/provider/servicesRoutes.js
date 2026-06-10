
// routes/provider/servicesRoutes.js

// TODO: uncomment middleware once auth is active
// router.use(authMiddleware);
// router.use(providerOnlyMiddleware);

const express = require("express");
const router = express.Router();
const servicesController = require("../../controllers/provider/servicesController");

// ⚠ ORDER MATTERS — specific routes must come before /:id

// ── Categories ───────────────────────────────────────────────────
// GET    /provider/services/categories         — all categories + count
// POST   /provider/services/categories         — add new category
// DELETE /provider/services/categories/:id     — delete provider category
router.get("/categories", servicesController.getCategories);
router.post("/categories", servicesController.addCategory);
router.delete("/categories/:id", servicesController.deleteCategory);

// ── Services ─────────────────────────────────────────────────────
// GET  /provider/services          — all provider services + stats
// POST /provider/services          — create new service
router.get("/", servicesController.getServices);
router.post("/", servicesController.addService);

// GET    /provider/services/:id    — single service
// PATCH  /provider/services/:id    — update service
// DELETE /provider/services/:id    — delete service
router.get("/:id", servicesController.getServiceById);
router.patch("/:id", servicesController.updateService);
router.delete("/:id", servicesController.deleteService);

module.exports = router;