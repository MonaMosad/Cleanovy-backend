 const User = require("../models/userModel");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateRandomToken,
  hashToken,
} = require("../utils/jwt");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../services/emailService");
const logger = require("../config/logger");

// ─── Helper: Send tokens in response  
const sendTokenResponse = async (user, statusCode, res, message = "success") => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = hashToken(refreshToken);
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  res.status(statusCode).json({
    status: "success",
    message,
    data: {
      user: user.toSafeObject(),
      accessToken,
      refreshToken,
    },
  });
};

// ─── @route  POST /api/v1/auth/register  
exports.register = async (req, res, next) => {
  try {
    const { fullName, phone, email, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json({
        status: "fail",
        message:
          existingUser.email === email
            ? "البريد الإلكتروني مستخدم بالفعل"
            : "رقم الهاتف مستخدم بالفعل",
      });
    }

    const allowedRoles = ["client", "laundry_owner"];
    const userRole = allowedRoles.includes(role) ? role : "client";

    const rawToken = generateRandomToken();
    const hashedToken = hashToken(rawToken);

    // هن ضيف console.log عشان نتاكد ان التوكن بيتولد صح وبيتبعت للايميل
    console.log("Verification Token:", rawToken);

    const user = await User.create({
      fullName,
      phone,
      email,
      password,
      role: userRole,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    try {
      await sendVerificationEmail(user, rawToken);
      console.log("email sent successefully");
    } catch (emailError) {
      logger.error("email failed :",emailError);
    }

    await sendTokenResponse(user, 201, res, "تم إنشاء الحساب بنجاح. يرجى تأكيد بريدك الإلكتروني");
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    next(error);
  }
};

// ─── @route  POST /api/v1/auth/login 
exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        status: "fail",
        message: "البريد الإلكتروني/الهاتف وكلمة المرور مطلوبان",
      });
    }

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: "fail",
        message: "بيانات الدخول غير صحيحة",
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        status: "fail",
        message: "تم حظر هذا الحساب. تواصل مع الدعم الفني",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        status: "fail",
        message: "هذا الحساب غير نشط",
      });
    }

    await sendTokenResponse(user, 200, res, "تم تسجيل الدخول بنجاح");
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    next(error);
  }
};

// ─── @route  POST /api/v1/auth/refresh-token  
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ status: "fail", message: "Refresh token مطلوب" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const hashedToken = hashToken(refreshToken);

    const user = await User.findOne({
      _id: decoded.id,
      refreshToken: hashedToken,
    }).select("+refreshToken");

    if (!user) {
      return res.status(401).json({ status: "fail", message: "Refresh token غير صالح أو منتهي" });
    }

    const newAccessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = hashToken(newRefreshToken);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    return res.status(401).json({ status: "fail", message: "Refresh token غير صالح أو منتهي" });
  }
};

// ─── @route  POST /api/v1/auth/logout 
exports.logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.status(200).json({ status: "success", message: "تم تسجيل الخروج بنجاح" });
  } catch (error) {
    next(error);
  }
};

// ─── @route  GET /api/v1/auth/verify-email  
exports.verifyEmail = async (req, res, next) => {
  try {
    //  بيدعم query string و params الاتنين
    //const token = req.query.token || req.params.token;
    const token = req.params.token;

    if (!token) {
      return res.status(400).json({
        status: "fail",
        message: "التوكن مفقود",
      });
    }

    const hashedToken = hashToken(token);

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    }).select("+emailVerificationToken +emailVerificationExpires");

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "رابط التحقق غير صالح أو منتهي الصلاحية",
      });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ status: "success", message: "تم تأكيد البريد الإلكتروني بنجاح" });
  } catch (error) {
    next(error);
  }
};

// ─── @route  POST /api/v1/auth/forgot-password  
exports.forgotPassword = async (req, res, next) => {
  try {
    const { identifier } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier?.toLowerCase() }, { phone: identifier }],
    });

    if (!user) {
      return res.status(200).json({
        status: "success",
        message: "إذا كان الحساب موجوداً، سيتم إرسال رابط الاستعادة إليك",
      });
    }

    const rawToken = generateRandomToken();
    const hashedToken = hashToken(rawToken);
    // هن ضيف console.log عشان نتاكد ان التوكن بيتولد صح وبيتبعت للايميل
    console.log("Reset Token:", rawToken);

 

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    await sendPasswordResetEmail(user, rawToken);

    res.status(200).json({
      status: "success",
      message: "تم إرسال رابط الاستعادة إلى بريدك الإلكتروني",
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route  POST /api/v1/auth/reset-password/:token  
exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = hashToken(req.params.token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "رابط إعادة التعيين غير صالح أو منتهي الصلاحية",
      });
    }

    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "كلمتا المرور غير متطابقتين",
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshToken = undefined;
    await user.save();

    res.status(200).json({ status: "success", message: "تم تغيير كلمة المرور بنجاح" });
  } catch (error) {
    next(error);
  }
};

// ─── @route  GET /api/v1/auth/me  
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    next(error);
  }
};

// ─── @route  POST /api/v1/auth/change-password 
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        status: "fail",
        message: "كلمة المرور الحالية غير صحيحة",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "كلمتا المرور الجديدتان غير متطابقتين",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ status: "success", message: "تم تغيير كلمة المرور بنجاح" });
  } catch (error) {
    next(error);
  }
};

// ─── @route  GET /api/v1/auth/google  
exports.googleCallback = async (req, res, next) => {
  try {
    await sendTokenResponse(req.user, 200, res, "تم تسجيل الدخول بواسطة Google بنجاح");
  } catch (error) {
    next(error);
  }
};

// ─── @route  GET /api/v1/auth/facebook  
exports.facebookCallback = async (req, res, next) => {
  try {
    await sendTokenResponse(req.user, 200, res, "تم تسجيل الدخول بواسطة Facebook بنجاح");
  } catch (error) {
    next(error);
  }
};