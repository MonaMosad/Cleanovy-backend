const mongoose = require("mongoose");
const LaundryShop = require("../../models/laundryShopModel");
const ProviderService = require("../../models/providerServiceModel");
const Order = require("../../models/orderModel");
const Review = require("../../models/reviewModel");
const User = require("../../models/userModel");
const Region = require("../../models/regionModel");
const escapeRegex = (str = "") => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* ──────────────────────────────────────────────────────────────
   1) لستة المغاسل المعتمدة + سيرش + pagination
   GET /api/admin/laundries?search=&page=&limit=&status=
   - بترجع المغاسل اللي is_verified: true بس (تبويب "المغاسل المعتمدة")
   - status: active (افتراضي) | suspended | all
────────────────────────────────────────────────────────────── */
exports.getLaundries = async (req, res, next) => {
  try {
    const page  = Math.max(parseInt(req.query.page)  || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip  = (page - 1) * limit;
    const search = (req.query.search || "").trim();
    const status = req.query.status || "active";

    const query = { is_verified: true };

    if (status === "active")    query.is_suspended = false;
    else if (status === "suspended") query.is_suspended = true;

    if (search) {
      const rx = new RegExp(escapeRegex(search), "i");
      query.$or = [{ name: rx }, { address: rx }, { phone: rx }];
    }

    const [laundries, total] = await Promise.all([
      LaundryShop.find(query)
        .select("name phone address region avg_rating total_reviews logo is_active is_suspended createdAt")
        .populate("region", "name city")
        .populate({
          path: "user",
          select: "fullName email",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      LaundryShop.countDocuments(query),
    ]);

    // جيب الخدمات لكل مغسلة في query واحدة بدل loop
    const laundryIds = laundries.map((l) => l._id);
    const services   = await ProviderService.find({
      provider: { $in: laundryIds },
      is_active: true,
    })
      .select("provider service")
      .populate("service", "name")
      .lean();

    // نجمّع الخدمات على الـ provider id بتاعها
    const servicesMap = {};
    services.forEach((s) => {
      const pid = s.provider.toString();
      if (!servicesMap[pid]) servicesMap[pid] = [];
      servicesMap[pid].push(s.service?.name);
    });

    res.json({
      status: "success",
      data: {
        laundries: laundries.map((l) => ({
          id:          l._id,
          name:        l.name,
          phone:       l.phone,
          address:     l.address,
          region:      l.region?.name || null,
          logo:        l.logo || null,
          avgRating:   l.avg_rating,
          totalReviews:l.total_reviews,
          isActive:    l.is_active,
          isSuspended: l.is_suspended,
          owner:       l.user ? { name: l.user.fullName, email: l.user.email } : null,
          services:    servicesMap[l._id.toString()] || [],
          joinedAt:    l.createdAt,
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ──────────────────────────────────────────────────────────────
   2) عرض مغسلة واحدة + خدماتها + إحصائياتها (أيقونة العين)
   GET /api/admin/laundries/:id
────────────────────────────────────────────────────────────── */
exports.getLaundryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid laundry id" });
    }

    const laundry = await LaundryShop.findOne({ _id: id, is_verified: true })
      .populate("region", "name city")
      .populate("user", "fullName email phone")
      .lean();

    if (!laundry) {
      return res.status(404).json({ status: "fail", message: "Laundry not found" });
    }

    // الخدمات + الإحصائيات بالتوازي
    const [services, ordersCount, revenueAgg, reviews] = await Promise.all([
      // الخدمات النشطة بتاعت المغسلة
      ProviderService.find({ provider: id, is_active: true })
        .populate("service", "name unit")
        .select("price unit service")
        .lean(),

      // إجمالي عدد الأوردرات
      Order.countDocuments({ provider: id }),

      // إجمالي الإيرادات من الأوردرات المدفوعة
      Order.aggregate([
        { $match: { provider: new mongoose.Types.ObjectId(id), payment_status: "paid" } },
        { $group: { _id: null, total: { $sum: "$total_price" } } },
      ]),

      // آخر 5 ريفيوز
      Review.find({ provider: id, is_hidden: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("client", "fullName avatar")
        .select("rating comment createdAt client")
        .lean(),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      status: "success",
      data: {
        profile: {
          id:           laundry._id,
          name:         laundry.name,
          description:  laundry.description,
          phone:        laundry.phone,
          address:      laundry.address,
          region:       laundry.region?.name || null,
          logo:         laundry.logo || null,
          images:       laundry.images || [],
          workingHours: laundry.working_hours || [],
          isActive:     laundry.is_active,
          isSuspended:  laundry.is_suspended,
          owner: laundry.user
            ? { name: laundry.user.fullName, email: laundry.user.email, phone: laundry.user.phone }
            : null,
          joinedAt: laundry.createdAt,
        },
        services: services.map((s) => ({
          name:  s.service?.name,
          price: s.price,
          unit:  s.unit,
        })),
        stats: {
          ordersCount,
          totalRevenue,
          avgRating:    laundry.avg_rating,
          totalReviews: laundry.total_reviews,
        },
        recentReviews: reviews.map((r) => ({
          client:    r.client?.fullName || "مجهول",
          avatar:    r.client?.avatar || null,
          rating:    r.rating,
          comment:   r.comment,
          createdAt: r.createdAt,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ──────────────────────────────────────────────────────────────
   3) إيقاف مغسلة (soft suspend)
   PATCH /api/admin/laundries/:id/suspend
   - بنوقّف المغسلة بـ is_suspended: true مع سبب الإيقاف
────────────────────────────────────────────────────────────── */
exports.suspendLaundry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // سبب الإيقاف (اختياري)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid laundry id" });
    }

    const laundry = await LaundryShop.findOneAndUpdate(
      { _id: id, is_verified: true },
      { is_suspended: true, suspension_reason: reason || "موقوفة بواسطة الأدمن" },
      { new: true }
    ).select("name is_suspended suspension_reason");

    if (!laundry) {
      return res.status(404).json({ status: "fail", message: "Laundry not found" });
    }

    res.json({
      status: "success",
      message: "Laundry suspended successfully",
      data: { id: laundry._id, name: laundry.name, isSuspended: laundry.is_suspended },
    });
  } catch (err) {
    next(err);
  }
};

/* ──────────────────────────────────────────────────────────────
   4) إعادة تفعيل مغسلة موقوفة
   PATCH /api/admin/laundries/:id/restore
────────────────────────────────────────────────────────────── */
exports.restoreLaundry = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid laundry id" });
    }

    const laundry = await LaundryShop.findOneAndUpdate(
      { _id: id, is_verified: true },
      { is_suspended: false, suspension_reason: null },
      { new: true }
    ).select("name is_suspended");

    if (!laundry) {
      return res.status(404).json({ status: "fail", message: "Laundry not found" });
    }

    res.json({
      status: "success",
      message: "Laundry restored successfully",
      data: { id: laundry._id, name: laundry.name, isSuspended: laundry.is_suspended },
    });
  } catch (err) {
    next(err);
  }
};

/* ──────────────────────────────────────────────────────────────
   5) المغاسل قيد الموافقة (تبويب "قيد الموافقة")
   GET /api/admin/laundries/pending
────────────────────────────────────────────────────────────── */
exports.getPendingLaundries = async (req, res, next) => {
  try {
    const page  = Math.max(parseInt(req.query.page)  || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip  = (page - 1) * limit;

    const [laundries, total] = await Promise.all([
      LaundryShop.find({ is_verified: false })
        .select("name phone address region logo createdAt")
        .populate("region", "name")
        .populate("user", "fullName email phone national_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      LaundryShop.countDocuments({ is_verified: false }),
    ]);

    const laundryIds = laundries.map((l) => l._id);
    const services   = await ProviderService.find({ provider: { $in: laundryIds } })
      .populate("service", "name")
      .select("provider service price unit")
      .lean();

    const servicesMap = {};
    services.forEach((s) => {
      const pid = s.provider.toString();
      if (!servicesMap[pid]) servicesMap[pid] = [];
      servicesMap[pid].push({ name: s.service?.name, price: s.price, unit: s.unit });
    });

    res.json({
      status: "success",
      data: {
        laundries: laundries.map((l) => ({
          id:       l._id,
          name:     l.name,
          phone:    l.phone,
          address:  l.address,
          region:   l.region?.name || null,
          logo:     l.logo || null,
          owner:    l.user ? { name: l.user.fullName, email: l.user.email, phone: l.user.phone, nationalId: l.user.national_id } : null,
          services: servicesMap[l._id.toString()] || [],
          appliedAt: l.createdAt,
        })),
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ──────────────────────────────────────────────────────────────
   6) قبول مغسلة قيد الموافقة
   PATCH /api/admin/laundries/:id/approve
────────────────────────────────────────────────────────────── */
exports.approveLaundry = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid laundry id" });
    }

    const laundry = await LaundryShop.findOneAndUpdate(
      { _id: id, is_verified: false },
      { is_verified: true },
      { new: true }
    ).select("name is_verified");

    if (!laundry) {
      return res.status(404).json({ status: "fail", message: "Laundry not found or already approved" });
    }

    res.json({
      status: "success",
      message: "Laundry approved successfully",
      data: { id: laundry._id, name: laundry.name },
    });
  } catch (err) {
    next(err);
  }
};

/* ──────────────────────────────────────────────────────────────
   7) رفض مغسلة قيد الموافقة (حذف نهائي)
   DELETE /api/admin/laundries/:id/reject
   - بنمسح المغسلة + الـ user بتاعها + الخدمات
────────────────────────────────────────────────────────────── */
exports.rejectLaundry = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid laundry id" });
    }

    const laundry = await LaundryShop.findOne({ _id: id, is_verified: false });
    if (!laundry) {
      return res.status(404).json({ status: "fail", message: "Laundry not found or already approved" });
    }

    await Promise.all([
      LaundryShop.deleteOne({ _id: id }),
      ProviderService.deleteMany({ provider: id }),
      User.findByIdAndDelete(laundry.user),
    ]);

    res.json({
      status: "success",
      message: "Laundry rejected and deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};