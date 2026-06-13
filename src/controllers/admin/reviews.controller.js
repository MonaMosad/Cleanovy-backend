const mongoose = require("mongoose");
const Review = require("../../models/reviewModel");

const escapeRegex = (str = "") => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* ──────────────────────────────────────────────────────────────
   1) لستة التقييمات + فلتر بالمغسلة/التقييم + سيرش + pagination
   GET /api/admin/reviews?provider=&rating=&search=&status=&page=&limit=
   - provider: id المغسلة
   - rating: 1..5
   - status: visible (افتراضي) | hidden | all
   - search: بيدوّر في التعليق
────────────────────────────────────────────────────────────── */
exports.getReviews = async (req, res, next) => {
  try {
    const page  = Math.max(parseInt(req.query.page)  || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip  = (page - 1) * limit;
    const provider = req.query.provider;
    const rating   = parseInt(req.query.rating);
    const status   = req.query.status || "visible";
    const search   = (req.query.search || "").trim();

    const query = {};

    // فلتر الحالة (الظاهر/المخفي)
    if (status === "visible")     query.is_hidden = false;
    else if (status === "hidden") query.is_hidden = true;
    // all → مفيش فلتر

    // فلتر بالمغسلة
    if (provider && mongoose.Types.ObjectId.isValid(provider)) {
      query.provider = provider;
    }

    // فلتر بالتقييم
    if (rating >= 1 && rating <= 5) {
      query.rating = rating;
    }

    // سيرش في التعليق
    if (search) {
      query.comment = new RegExp(escapeRegex(search), "i");
    }

    const [reviews, total, totalAll] = await Promise.all([
      Review.find(query)
        .select("client provider rating comment is_hidden createdAt")
        .populate("client", "fullName avatar")
        .populate("provider", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(query),
      Review.countDocuments({ is_hidden: false }), // إجمالي التقييمات الظاهرة (للعدّاد فوق)
    ]);

    res.json({
      status: "success",
      data: {
        totalReviews: totalAll,
        reviews: reviews.map((r) => ({
          id:        r._id,
          client:    r.client?.fullName || "مجهول",
          avatar:    r.client?.avatar || null,
          provider:  r.provider?.name || "—",
          rating:    r.rating,
          comment:   r.comment,
          isHidden:  r.is_hidden,
          createdAt: r.createdAt,
        })),
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ──────────────────────────────────────────────────────────────
   2) إخفاء/إظهار ريفيو (toggle) — أيقونة العين
   PATCH /api/admin/reviews/:id/toggle-hide
────────────────────────────────────────────────────────────── */
exports.toggleHideReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid review id" });
    }

    const review = await Review.findById(id).select("is_hidden");
    if (!review) {
      return res.status(404).json({ status: "fail", message: "Review not found" });
    }

    review.is_hidden = !review.is_hidden;
    await review.save();

    res.json({
      status: "success",
      message: review.is_hidden ? "Review hidden" : "Review unhidden",
      data: { id: review._id, isHidden: review.is_hidden },
    });
  } catch (err) {
    next(err);
  }
};

/* ──────────────────────────────────────────────────────────────
   3) حذف ريفيو نهائياً (hard delete) — أيقونة السلة
   DELETE /api/admin/reviews/:id
────────────────────────────────────────────────────────────── */
exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid review id" });
    }

    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ status: "fail", message: "Review not found" });
    }

    res.json({
      status: "success",
      message: "Review deleted successfully",
      data: { id: review._id },
    });
  } catch (err) {
    next(err);
  }
};
