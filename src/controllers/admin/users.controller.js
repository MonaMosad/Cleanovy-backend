// const mongoose = require("mongoose");
// const User = require("../../models/userModel");
// const Order = require("../../models/orderModel");

// // نهرب رموز الـ regex الخاصة عشان السيرش ما يكسرش لو حد كتب ( أو *
// const escapeRegex = (str = "") => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// /* ──────────────────────────────────────────────────────────────
//    1) لستة المستخدمين + السيرش + الـ pagination
//    GET /api/admin/users?search=&page=&limit=&status=
//    - بترجع العملاء (role: client) بس، لإن المغاسل ليها صفحة لوحدها
//    - status: active (افتراضي) | inactive | all
//      عشان لما تعملي soft delete اليوزر يختفي من اللستة تلقائياً
// ────────────────────────────────────────────────────────────── */
// exports.getUsers = async (req, res, next) => {
//   try {
//     const page = Math.max(parseInt(req.query.page) || 1, 1);
//     const limit = Math.max(parseInt(req.query.limit) || 10, 1);
//     const skip = (page - 1) * limit;
//     const search = (req.query.search || "").trim();
//     const status = req.query.status || "active";

//     const query = { role: "client" };

//     // فلتر الحالة
//     if (status === "active") query.is_active = true;
//     else if (status === "inactive") query.is_active = false;
//     // status === "all" → بنسيبه من غير فلتر

//     // السيرش بالاسم أو الإيميل أو الموبايل
//     if (search) {
//       const rx = new RegExp(escapeRegex(search), "i");
//       query.$or = [{ name: rx }, { email: rx }, { phone: rx }];
//     }

//     const [users, total] = await Promise.all([
//       User.find(query)
//         .select("name email phone image is_active createdAt")
//         .sort({ createdAt: -1 })   // الأحدث الأول
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       User.countDocuments(query),
//     ]);

//     res.json({
//       status: "success",
//       data: {
//         users: users.map((u) => ({
//           id: u._id,
//           name: u.name,
//           email: u.email,
//           phone: u.phone,
//           image: u.image || null,   // لو مفيش field للصورة → null والفرونت يعمل الحرف الأول
//           isActive: u.is_active,
//           joinedAt: u.createdAt,
//         })),
//         pagination: {
//           total,
//           page,
//           limit,
//           totalPages: Math.ceil(total / limit) || 1,
//         },
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// /* ──────────────────────────────────────────────────────────────
//    2) عرض يوزر واحد + إحصائياته (أيقونة العين)
//    GET /api/admin/users/:id
//    - البروفايل + عدد الأوردرات + إجمالي المصروف + آخر أوردر
// ────────────────────────────────────────────────────────────── */
// exports.getUserById = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     // نتأكد إن الـ id شكله ObjectId صح قبل أي query (نتفادى CastError)
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ status: "fail", message: "Invalid user id" });
//     }

//     const user = await User.findOne({ _id: id, role: "client" })
//       .select("name username email phone national_id image is_active is_banned is_verified createdAt")
//       .lean();

//     if (!user) {
//       return res.status(404).json({ status: "fail", message: "User not found" });
//     }

//     // الإحصائيات الـ3 بالتوازي
//     const [ordersCount, spentAgg, lastOrder] = await Promise.all([
//       // إجمالي عدد الأوردرات (بكل الحالات)
//       Order.countDocuments({ client: user._id }),

//       // إجمالي المصروف = مجموع total_price للأوردرات المدفوعة بس
//       // (لو تحبي تحسبيها على status: "delivered" بدّلي السطر تحت)
//       Order.aggregate([
//         { $match: { client: user._id, payment_status: "paid" } },
//         { $group: { _id: null, total: { $sum: "$total_price" } } },
//       ]),

//       // آخر أوردر اتعمل
//       Order.findOne({ client: user._id })
//         .sort({ createdAt: -1 })
//         .select("total_price status createdAt")
//         .lean(),
//     ]);

//     const totalSpent = spentAgg[0]?.total || 0;

//     res.json({
//       status: "success",
//       data: {
//         profile: {
//           id: user._id,
//           name: user.name,
//           username: user.username,
//           email: user.email,
//           phone: user.phone,
//           nationalId: user.national_id,
//           image: user.image || null,
//           isActive: user.is_active,
//           isBanned: user.is_banned,
//           joinedAt: user.createdAt,
//         },
//         stats: {
//           ordersCount,
//           totalSpent,
//           lastOrder: lastOrder
//             ? {
//                 orderNumber: `ORD-${lastOrder._id.toString().slice(-6)}#`, // نفس فورمات الداش بورد
//                 amount: lastOrder.total_price,
//                 status: lastOrder.status,
//                 createdAt: lastOrder.createdAt,
//               }
//             : null,
//         },
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// /* ──────────────────────────────────────────────────────────────
//    3) حذف يوزر (Soft delete) — أيقونة سلة المهملات
//    DELETE /api/admin/users/:id
//    - مش بنمسح فعلياً، بنوقّف الحساب بس (is_active: false)
//    - الأوردرات والعناوين تفضل زي ما هي، فاسم العميل يفضل ظاهر في صفحة الأوردرات
// ────────────────────────────────────────────────────────────── */
// exports.deleteUser = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ status: "fail", message: "Invalid user id" });
//     }

//     const user = await User.findOneAndUpdate(
//       { _id: id, role: "client" },
//       { is_active: false },
//       { new: true }
//     ).select("name email is_active");

//     if (!user) {
//       return res.status(404).json({ status: "fail", message: "User not found" });
//     }

//     res.json({
//       status: "success",
//       message: "User deactivated successfully",
//       data: { id: user._id, name: user.name, isActive: user.is_active },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// /* ──────────────────────────────────────────────────────────────
//    4) (اختياري) إعادة تفعيل يوزر اتعمله soft delete
//    PATCH /api/admin/users/:id/restore
//    - مفيش زرار ليها في الديزاين الحالي، بس مفيدة عشان الـ soft delete
//      يبقى ليه معنى (تقدري تضيفي زرار "تفعيل" في تبويب الحسابات الموقوفة)
// ────────────────────────────────────────────────────────────── */
// exports.restoreUser = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ status: "fail", message: "Invalid user id" });
//     }

//     const user = await User.findOneAndUpdate(
//       { _id: id, role: "client" },
//       { is_active: true },
//       { new: true }
//     ).select("name email is_active");

//     if (!user) {
//       return res.status(404).json({ status: "fail", message: "User not found" });
//     }

//     res.json({
//       status: "success",
//       message: "User reactivated successfully",
//       data: { id: user._id, name: user.name, isActive: user.is_active },
//     });
//   } catch (err) {
//     next(err);
//   }
// };




const mongoose = require("mongoose");
const User = require("../../models/userModel");
const Order = require("../../models/orderModel");

const escapeRegex = (str = "") => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// 1) لستة + سيرش + pagination
exports.getUsers = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;
    const search = (req.query.search || "").trim();
    const status = req.query.status || "active";

    const query = { role: "client" };

    if (status === "active") query.isActive = true;
    else if (status === "inactive") query.isActive = false;

    if (search) {
      const rx = new RegExp(escapeRegex(search), "i");
      query.$or = [{ fullName: rx }, { email: rx }, { phone: rx }];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select("fullName email phone avatar isActive createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    res.json({
      status: "success",
      data: {
        users: users.map((u) => ({
          id: u._id,
          name: u.fullName,
          email: u.email,
          phone: u.phone,
          image: u.avatar || null,
          isActive: u.isActive,
          joinedAt: u.createdAt,
        })),
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
      },
    });
  } catch (err) {
    next(err);
  }
};

// 2) عرض يوزر + إحصائياته
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid user id" });
    }

    const user = await User.findOne({ _id: id, role: "client" })
      .select("fullName username email phone national_id avatar isActive isBanned isVerified createdAt")
      .lean();

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    const [ordersCount, spentAgg, lastOrder] = await Promise.all([
      Order.countDocuments({ client: user._id }),
      Order.aggregate([
        { $match: { client: user._id, payment_status: "paid" } },
        { $group: { _id: null, total: { $sum: "$total_price" } } },
      ]),
      Order.findOne({ client: user._id })
        .sort({ createdAt: -1 })
        .select("total_price status createdAt")
        .lean(),
    ]);

    const totalSpent = spentAgg[0]?.total || 0;

    res.json({
      status: "success",
      data: {
        profile: {
          id: user._id,
          name: user.fullName,
          username: user.username,
          email: user.email,
          phone: user.phone,
          nationalId: user.national_id,
          image: user.avatar || null,
          isActive: user.isActive,
          isBanned: user.isBanned,
          joinedAt: user.createdAt,
        },
        stats: {
          ordersCount,
          totalSpent,
          lastOrder: lastOrder
            ? {
                orderNumber: `ORD-${lastOrder._id.toString().slice(-6)}#`,
                amount: lastOrder.total_price,
                status: lastOrder.status,
                createdAt: lastOrder.createdAt,
              }
            : null,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// 3) حذف (soft delete)
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid user id" });
    }

    const user = await User.findOneAndUpdate(
      { _id: id, role: "client" },
      { isActive: false },
      { new: true }
    ).select("fullName email isActive");

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    res.json({
      status: "success",
      message: "User deactivated successfully",
      data: { id: user._id, name: user.fullName, isActive: user.isActive },
    });
  } catch (err) {
    next(err);
  }
};

// 4) إعادة تفعيل
exports.restoreUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid user id" });
    }

    const user = await User.findOneAndUpdate(
      { _id: id, role: "client" },
      { isActive: true },
      { new: true }
    ).select("fullName email isActive");

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    res.json({
      status: "success",
      message: "User reactivated successfully",
      data: { id: user._id, name: user.fullName, isActive: user.isActive },
    });
  } catch (err) {
    next(err);
  }
};