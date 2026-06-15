
// // routes/provider/dashboardRoutes.js

// // TODO: uncomment middleware once auth is active
// // router.use(authMiddleware);
// // router.use(providerOnlyMiddleware);

// const express = require("express");
// const router = express.Router();
// const dashboardController = require("../../controllers/provider/dashboardController");

// // ⚠ /live must come before / to avoid route conflicts
// router.get("/live", dashboardController.getDashboardLive); // SSE — real-time updates
// router.get("/", dashboardController.getDashboardStats);    // REST — one-time fetch

// module.exports = router;








const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const providerOnlyMiddleware = require("../../middleware/providerOnlyMiddleware");
const dashboardController = require("../../controllers/provider/dashboardController");

router.use(protect);
router.use(providerOnlyMiddleware);

router.get("/live", dashboardController.getDashboardLive);
router.get("/", dashboardController.getDashboardStats);

module.exports = router;