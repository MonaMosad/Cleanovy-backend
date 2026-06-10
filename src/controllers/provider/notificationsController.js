// controllers/provider/notificationsController.js
const Notification = require("../../models/notificationModel");

/**
 * GET /provider/notifications
 * Returns all notifications for this provider's user account.
 * Query: ?unread=true  → only unread
 */
const getNotifications = async (req, res) => {
  try {
    const filter = { recipient: req.user._id };
    if (req.query.unread === "true") filter.is_read = false;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      is_read: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /provider/notifications/:id/read
 * Mark a single notification as read.
 */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { is_read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "الإشعار مش موجود" });
    }

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /provider/notifications/read-all
 * Mark all notifications as read.
 */
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, is_read: false },
      { is_read: true }
    );

    res.status(200).json({ success: true, message: "تم تحديد الكل كمقروء" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /provider/notifications/:id
 * Delete a single notification.
 */
const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "الإشعار مش موجود" });
    }

    res.status(200).json({ success: true, message: "تم حذف الإشعار" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };