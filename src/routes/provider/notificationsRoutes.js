// routes/provider/notificationsRoutes.js
// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../../middleware/authMiddleware");
// const providerOnlyMiddleware = require("../../middleware/providerOnlyMiddleware");
// const notificationsController = require("../../controllers/provider/notificationsController");

// router.use(authMiddleware);
// router.use(providerOnlyMiddleware);

// // GET  /provider/notifications           → كل الإشعارات (+ ?unread=true)
// // PATCH /provider/notifications/read-all → اقرأ الكل  ← لازم قبل /:id
// // PATCH /provider/notifications/:id/read → اقرأ واحد
// // DELETE /provider/notifications/:id     → احذف واحد
// router.get("/", notificationsController.getNotifications);
// router.patch("/read-all", notificationsController.markAllAsRead);
// router.patch("/:id/read", notificationsController.markAsRead);
// router.delete("/:id", notificationsController.deleteNotification);

// module.exports = router;





// routes/provider/notificationsRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const providerOnlyMiddleware = require("../../middleware/providerOnlyMiddleware");
const notificationsController = require("../../controllers/provider/notificationsController");

router.use(protect);
router.use(providerOnlyMiddleware);

// GET  /provider/notifications           → كل الإشعارات (+ ?unread=true)
// PATCH /provider/notifications/read-all → اقرأ الكل  ← لازم قبل /:id
// PATCH /provider/notifications/:id/read → اقرأ واحد
// DELETE /provider/notifications/:id     → احذف واحد
router.get("/", notificationsController.getNotifications);
router.patch("/read-all", notificationsController.markAllAsRead);
router.patch("/:id/read", notificationsController.markAsRead);
router.delete("/:id", notificationsController.deleteNotification);

module.exports = router;