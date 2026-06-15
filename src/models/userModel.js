

// // models/user.model.js
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     // ─── Identity ──────────────────────────────────────────────
//     username: { type: String, unique: true },

//     national_id: { type: String },

//     role: {
//       type: String,
//       enum: ["client", "laundry_owner", "admin"],
//       default: "client",
//       required: true,
//     },

//     // ─── Basic Info ────────────────────────────────────────────
//     fullName: {
//       type: String,
//       required: [true, "الاسم الكامل مطلوب"],
//       trim: true,
//       minlength: [3, "الاسم يجب أن يكون 3 أحرف على الأقل"],
//       maxlength: [100, "الاسم لا يتجاوز 100 حرف"],
//     },

//     // ✅ kept from mona: username support
//     username: { type: String, unique: true, sparse: true, trim: true },

//     phone: {
//       type: String,
//       required: [true, "رقم الهاتف مطلوب"],
//       unique: true,
//       sparse: true,
//       match: [/^01\d{9}$/, "رقم الهاتف المصري غير صالح"],
//     },

//     email: {
//       type: String,
//       required: [true, "البريد الإلكتروني مطلوب"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, "البريد الإلكتروني غير صالح"],
//     },

//     password: {
//       type: String,
//       minlength: [8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"],
//       select: false,
//     },

//     // ✅ kept from mona
//     national_id: { type: String, trim: true },

//     avatar: { type: String, default: null },

//     // ─── Address ───────────────────────────────────────────────
//     address: {
//       type: String,
//       default: null,
//       trim: true,
//     },

//     // ─── Auth Methods ──────────────────────────────────────────
//     authProvider: {
//       type: String,
//       enum: ["local", "google", "facebook"],
//       default: "local",
//     },
//     googleId: { type: String, default: null },
//     facebookId: { type: String, default: null },

//     // ─── Account Status ────────────────────────────────────────
//     isVerified: { type: Boolean, default: false },
//     isActive: { type: Boolean, default: true },
//     isBanned: { type: Boolean, default: false },

//     // ─── Verification & Reset Tokens ───────────────────────────
//     emailVerificationToken: { type: String, select: false },
//     emailVerificationExpires: { type: Date, select: false },

//     passwordResetToken: { type: String, select: false },
//     passwordResetExpires: { type: Date, select: false },

//     // ─── Refresh Token ──────────────────────────────────────────
//     refreshToken: { type: String, select: false },

//     // ─── Timestamps ───────────────────────────────────────────
//     lastLogin: { type: Date, default: null },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// // ─── Indexes ─────────────────────────────────────────────────
// // email, phone, and username already have `unique: true`, which
// // creates indexes automatically. Only add explicit indexes for
// // fields that need one but aren't unique.
// userSchema.index({ role: 1 });

// // ─── Pre-save: Hash Password ───────────────────────────────────
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(12);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // ─── Method: Compare Password ──────────────────────────────────
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// // ─── Method: Safe output (no sensitive fields) ──────────────────
// userSchema.methods.toSafeObject = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   delete obj.refreshToken;
//   delete obj.emailVerificationToken;
//   delete obj.passwordResetToken;
//   return obj;
// };

// module.exports = mongoose.model("User", userSchema);





// models/user.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // ─── Identity ──────────────────────────────────────────────
    role: {
      type: String,
      enum: ["client", "laundry_owner", "admin"],
      default: "client",
      required: true,
    },

    // ─── Basic Info ────────────────────────────────────────────
    fullName: {
      type: String,
      required: [true, "الاسم الكامل مطلوب"],
      trim: true,
      minlength: [3, "الاسم يجب أن يكون 3 أحرف على الأقل"],
      maxlength: [100, "الاسم لا يتجاوز 100 حرف"],
    },

    username: { type: String, unique: true, sparse: true, trim: true },

    phone: {
      type: String,
      required: [true, "رقم الهاتف مطلوب"],
      unique: true,
      sparse: true,
      match: [/^01\d{9}$/, "رقم الهاتف المصري غير صالح"],
    },

    email: {
      type: String,
      required: [true, "البريد الإلكتروني مطلوب"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "البريد الإلكتروني غير صالح"],
    },

    password: {
      type: String,
      minlength: [8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"],
      select: false,
    },

    national_id: { type: String, trim: true },

    avatar: { type: String, default: null },

    // ─── Address ───────────────────────────────────────────────
    address: {
      type: String,
      default: null,
      trim: true,
    },

    // ─── Auth Methods ──────────────────────────────────────────
    authProvider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    googleId: { type: String, default: null },
    facebookId: { type: String, default: null },

    // ─── Account Status ────────────────────────────────────────
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },

    // ─── Verification & Reset Tokens ───────────────────────────
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },

    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },

    // ─── Refresh Token ──────────────────────────────────────────
    refreshToken: { type: String, select: false },

    // ─── Timestamps ───────────────────────────────────────────
    lastLogin: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ─────────────────────────────────────────────────
// email, phone, and username already have `unique: true`, which
// creates indexes automatically. Only add explicit indexes for
// fields that need one but aren't unique.
userSchema.index({ role: 1 });

// ─── Pre-save: Hash Password ───────────────────────────────────
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Method: Compare Password ──────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ─── Method: Safe output (no sensitive fields) ──────────────────
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.emailVerificationToken;
  delete obj.passwordResetToken;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
