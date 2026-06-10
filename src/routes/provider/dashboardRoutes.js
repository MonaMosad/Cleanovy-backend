


// // routes/provider/dashboardRoutes.js

// // في كل route file
// // router.use(authMiddleware);        // التحقق من التوكن
// // router.use(providerOnlyMiddleware); // التحقق إنه provider مش client

// const express = require("express");
// const router = express.Router();
// const dashboardController = require("../../controllers/provider/dashboardController");

// // GET /provider/dashboard  — KPIs + 7-day revenue chart
// router.get("/", dashboardController.getDashboardStats);

// module.exports = router;




// routes/provider/dashboardRoutes.js

// TODO: uncomment middleware once auth is active
// router.use(authMiddleware);
// router.use(providerOnlyMiddleware);

const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/provider/dashboardController");

// ⚠ /live must come before / to avoid route conflicts
router.get("/live", dashboardController.getDashboardLive); // SSE — real-time updates
router.get("/", dashboardController.getDashboardStats);    // REST — one-time fetch

module.exports = router;