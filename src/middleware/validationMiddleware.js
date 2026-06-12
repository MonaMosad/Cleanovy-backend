const { body, validationResult } = require("express-validator");

// ─── Handle validation errors  
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "fail",
      message: "بيانات غير صالحة",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Register Validation 
exports.validateRegister = [
  body("fullName")
    .trim()
    .notEmpty().withMessage("الاسم الكامل مطلوب")
    .isLength({ min: 3 }).withMessage("الاسم يجب أن يكون 3 أحرف على الأقل"),

  // body("phone")
  //   .trim()
  //   .notEmpty().withMessage("رقم الهاتف مطلوب")
  //   .matches(/^05\d{8}$/).withMessage("رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام"),

  body("phone")
  .trim()
  .notEmpty()
  .withMessage("رقم الهاتف مطلوب")
  .matches(/^01[0125]\d{8}$/)
  .withMessage(
    "رقم الهاتف يجب أن يتكون من 11 رقم ويبدأ بـ 010 أو 011 أو 012 أو 015"
  ),
  body("email")
    .trim()
    .notEmpty().withMessage("البريد الإلكتروني مطلوب")
    .isEmail().withMessage("البريد الإلكتروني غير صالح")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("كلمة المرور مطلوبة")
    .isLength({ min: 8 }).withMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .matches(/\d/).withMessage("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل"),

  body("role")
    .optional()
    .isIn(["client", "laundry_owner"]).withMessage("نوع الحساب غير صالح"),

  validate,
];

// ─── Login Validation  
exports.validateLogin = [
  body("identifier")
    .trim()
    .notEmpty().withMessage("البريد الإلكتروني أو رقم الهاتف مطلوب"),

  body("password")
    .notEmpty().withMessage("كلمة المرور مطلوبة"),

  validate,
];

// ─── Forgot Password Validation  
exports.validateForgotPassword = [
  body("identifier")
    .trim()
    .notEmpty().withMessage("البريد الإلكتروني أو رقم الهاتف مطلوب"),

  validate,
];

// ─── Reset Password Validation  
exports.validateResetPassword = [
  body("password")
    .notEmpty().withMessage("كلمة المرور مطلوبة")
    .isLength({ min: 8 }).withMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .matches(/\d/).withMessage("يجب أن تحتوي على رقم واحد على الأقل"),

  body("confirmPassword")
    .notEmpty().withMessage("تأكيد كلمة المرور مطلوب"),

  validate,
];

// ─── Change Password Validation  
exports.validateChangePassword = [
  body("currentPassword")
    .notEmpty().withMessage("كلمة المرور الحالية مطلوبة"),

  body("newPassword")
    .notEmpty().withMessage("كلمة المرور الجديدة مطلوبة")
    .isLength({ min: 8 }).withMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .matches(/\d/).withMessage("يجب أن تحتوي على رقم واحد على الأقل"),

  body("confirmPassword")
    .notEmpty().withMessage("تأكيد كلمة المرور مطلوب"),

  validate,
];


// في نهاية الملف، ضيف exports.validateUpdateProfile
exports.validateUpdateProfile = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage("الاسم يجب أن يكون 3 أحرف على الأقل"),

  // body("phone")
  //   .optional()
  //   .trim()
  //   .matches(/^05\d{8}$/).withMessage("رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام"),
  body("phone")
    .notEmpty()
    .withMessage("رقم الهاتف مطلوب")
    .matches(/^01[0125]\d{8}$/)
    .withMessage(
      "رقم الهاتف يجب أن يتكون من 11 رقم ويبدأ بـ 010 أو 011 أو 012 أو 015"
    ),
  body("address")
    .optional()
    .trim()
    .isLength({ min: 5 }).withMessage("العنوان يجب أن يكون 5 أحرف على الأقل"),

  validate, // الدالة الموجودة بالفعل في الملف
];
