const mongoose = require("mongoose");
const Review = require("../models/reviewModel");
const Order = require("../models/orderModel");

// helper: نعيد حساب متوسط التقييم وعدد الريفيوز للمغسلة
async function recalcLaundryRating(providerId) {
  const LaundryShop = require("../models/laundryShopModel");

  const stats = await Review.aggregate([
    { $match: { provider: new mongoose.Types.ObjectId(providerId), is_hidden: false } },
    {
      $group: {
        _id: null,
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const avg = stats[0]?.avg || 0;
  const count = stats[0]?.count || 0;

  await LaundryShop.findByIdAndUpdate(providerId, {
    avg_rating: Math.round(avg * 10) / 10, // تقريب لرقم عشري واحد
    total_reviews: count,
  });
}

/* ──────────────────────────────────────────────────────────────
   1) إضافة ريفيو على أوردر اتسلّم
   POST /api/reviews
   body: { orderId, rating, comment? }
   - الريفيو اختياري (مش إجباري بعد كل أوردر)
   - لازم يكون الأوردر بتاع نفس العميل
   - لازم يكون status: delivered
   - مينفعش يعمل ريفيو على نفس الأوردر مرتين
────────────────────────────────────────────────────────────── */
exports.addReview = async (req, res, next) => {
  try {
    const { orderId, rating, comment } = req.body;

    // TODO: لما الـ auth middleware يتعمل، نستبدل ده بـ req.user._id
    const clientId = req.body.clientId; // مؤقتاً من الـ body عشان التست

    // validation
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ status: "fail", message: "Order id is required" });
    }
    if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ status: "fail", message: "Client id is required" });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ status: "fail", message: "Rating must be between 1 and 5" });
    }

    // نتأكد إن الأوردر بتاع العميل ده وعليه delivered
    const order = await Order.findOne({ _id: orderId, client: clientId });
    if (!order) {
      return res.status(404).json({ status: "fail", message: "Order not found" });
    }
    if (order.status !== "delivered") {
      return res.status(400).json({
        status: "fail",
        message: "You can only review delivered orders",
      });
    }

    // نتأكد إنه ما عملش ريفيو على الأوردر ده قبل كده
    const existing = await Review.findOne({ order: orderId });
    if (existing) {
      return res.status(400).json({
        status: "fail",
        message: "You already reviewed this order",
      });
    }

    const review = await Review.create({
      client: clientId,
      provider: order.provider,
      order: orderId,
      rating,
      comment: comment || null,
    });

    // نعيد حساب متوسط التقييم للمغسلة
    await recalcLaundryRating(order.provider);

    res.status(201).json({
      status: "success",
      message: "Review added successfully",
      data: {
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ──────────────────────────────────────────────────────────────
   2) تعديل ريفيو
   PATCH /api/reviews/:id
   body: { rating?, comment? }
   - بس صاحب الريفيو يقدر يعدّله
────────────────────────────────────────────────────────────── */
exports.updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const clientId = req.body.clientId; // مؤقتاً، بعدين req.user._id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid review id" });
    }
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ status: "fail", message: "Rating must be between 1 and 5" });
    }

    const review = await Review.findOne({ _id: id, client: clientId });
    if (!review) {
      return res.status(404).json({ status: "fail", message: "Review not found" });
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    await review.save();

    // لو الـ rating اتغير نعيد حساب المتوسط
    if (rating !== undefined) {
      await recalcLaundryRating(review.provider);
    }

    res.json({
      status: "success",
      message: "Review updated successfully",
      data: {
        id: review._id,
        rating: review.rating,
        comment: review.comment,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ──────────────────────────────────────────────────────────────
   3) حذف ريفيو
   DELETE /api/reviews/:id
   - بس صاحب الريفيو يقدر يمسحه
────────────────────────────────────────────────────────────── */
exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const clientId = req.body.clientId; // مؤقتاً، بعدين req.user._id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "fail", message: "Invalid review id" });
    }

    const review = await Review.findOneAndDelete({ _id: id, client: clientId });
    if (!review) {
      return res.status(404).json({ status: "fail", message: "Review not found" });
    }

    // نعيد حساب المتوسط بعد الحذف
    await recalcLaundryRating(review.provider);

    res.json({
      status: "success",
      message: "Review deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
/* ──────────────────────────────────────────────────────────────
   عدّاد الريفيوز (إجمالي + ظاهرة + مخفية)
   GET /api/admin/reviews/count
────────────────────────────────────────────────────────────── */
exports.getReviewsCount = async (req, res, next) => {
  try {
    const [total, visible, hidden] = await Promise.all([
      Review.countDocuments(),
      Review.countDocuments({ is_hidden: false }),
      Review.countDocuments({ is_hidden: true }),
    ]);

    res.json({
      status: "success",
      data: { total, visible, hidden },
    });
  } catch (err) {
    next(err);
  }
};