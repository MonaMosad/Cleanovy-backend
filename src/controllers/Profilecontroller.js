const User = require("../models/userModel");
const logger = require("../config/logger");
const path = require("path");
const fs = require("fs");

// ─── @route  GET /api/v1/profile/me
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ status: "fail", message: "المستخدم غير موجود" });
    }
    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    logger.error(`getProfile error: ${error.message}`);
    next(error);
  }
};

// ─── @route  PATCH /api/v1/profile/update
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, address } = req.body;

    // لا تسمح بتغيير الإيميل أو الباسورد من هنا
    const forbiddenFields = ["email", "password", "role", "isBanned", "isAdmin"];
    for (const field of forbiddenFields) {
      if (req.body[field]) {
        return res.status(400).json({
          status: "fail",
          message: `لا يمكن تغيير حقل ${field} من هنا`,
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, phone, address },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      message: "تم تحديث البيانات بنجاح",
      data: { user: updatedUser },
    });
  } catch (error) {
    logger.error(`updateProfile error: ${error.message}`);
    next(error);
  }
};

// ─── @route  PATCH /api/v1/profile/avatar
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: "fail", message: "لم يتم رفع أي صورة" });
    }

    // حذف الصورة القديمة لو موجودة
    const user = req.user; // ← التغيير هنا
    if (user.avatar) {
      const oldPath = path.join("uploads", path.basename(user.avatar));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const avatarUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "تم تحديث الصورة بنجاح",
      data: { avatar: updatedUser.avatar },
    });
  } catch (error) {
    logger.error(`uploadAvatar error: ${error.message}`);
    next(error);
  }
};
// ─── @route  DELETE /api/v1/profile/avatar
exports.deleteAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.avatar) {
      const oldPath = path.join("uploads", path.basename(user.avatar));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await User.findByIdAndUpdate(req.user._id, { avatar: null });

    res.status(200).json({ status: "success", message: "تم حذف الصورة" });
  } catch (error) {
    logger.error(`deleteAvatar error: ${error.message}`);
    next(error);
  }
};

// ─── @route  GET /api/v1/profile/stats
// هيتكمل من زميلك لما يعمل الطلبات — دلوقتي بيرجع placeholder
exports.getStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // TODO: استبدل بالأرقام الحقيقية لما زميلك يعمل Order model
    const stats = {
      completedOrders: 0,   // Order.countDocuments({ user: req.user._id, status: 'completed' })
      loyaltyPoints: user.loyaltyPoints || 0,
      rating: user.rating || 0,
    };

    res.status(200).json({ status: "success", data: { stats } });
  } catch (error) {
    next(error);
  }
};