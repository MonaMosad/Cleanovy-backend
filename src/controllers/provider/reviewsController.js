// // controllers/provider/reviewsController.js
// const Review = require("../../models/reviewModel");
// const mongoose = require("mongoose");

// // ─────────────────────────────────────────────────────────────────
// //  HELPERS
// // ─────────────────────────────────────────────────────────────────

// /**
//  * Relative Arabic time string (e.g. "منذ يومين") for the `date` field
//  * the frontend displays directly.
//  */
// function timeAgoAr(date) {
//   if (!date) return "";
//   const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000); // seconds
//   if (diff < 60) return "الآن";
//   const mins = Math.floor(diff / 60);
//   if (mins < 60) return `منذ ${mins} دقيقة`;
//   const hrs = Math.floor(diff / 3600);
//   if (hrs < 24) return `منذ ${hrs} ساعة`;
//   const days = Math.floor(diff / 86400);
//   if (days === 1) return "منذ يوم";
//   if (days === 2) return "منذ يومين";
//   if (days < 11) return `منذ ${days} أيام`;
//   if (days < 30) return `منذ ${Math.floor(days / 7)} أسابيع`;
//   const months = Math.floor(days / 30);
//   if (months < 12) return `منذ ${months} شهر`;
//   return new Date(date).toLocaleDateString("ar-EG");
// }

// /**
//  * Shape a Review document into exactly what the Reviews page expects:
//  *   { id, customerName, rating, comment, orderId, date, reply? }
//  */
// function toReviewDTO(doc) {
//   return {
//     id: doc._id.toString(),
//     customerName: doc.customerName || "عميل",
//     rating: doc.rating,
//     comment: doc.comment || "",
//     orderId: doc.orderCode || (doc.order ? doc.order.toString() : ""),
//     date: timeAgoAr(doc.createdAt),
//     reply: doc.reply || undefined,
//   };
// }

// // ─────────────────────────────────────────────────────────────────
// //  REVIEWS
// // ─────────────────────────────────────────────────────────────────

// /**
//  * GET /provider/reviews
//  * All reviews for this provider, newest first.
//  * Returns `data` (the page renders it) plus `stats`
//  * (the page currently recomputes these client-side, so stats are optional).
//  */
// const getReviews = async (req, res) => {
//   try {
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");

//     const reviews = await Review.find({ provider: providerId }).sort({ createdAt: -1 });

//     const data = reviews.map(toReviewDTO);

//     // ── Stats ──────────────────────────────────────────────────
//     const total = reviews.length;
//     const avg =
//       total > 0
//         ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10
//         : 0;
//     const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
//     reviews.forEach((r) => {
//       counts[r.rating] = (counts[r.rating] || 0) + 1;
//     });

//     res.status(200).json({
//       success: true,
//       count: total,
//       stats: { total, avg, counts },
//       data,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * POST /provider/reviews/:id/reply
//  * Provider replies to one of their reviews.
//  * Body: { reply }
//  */
// const replyToReview = async (req, res) => {
//   try {
//     const providerId = new mongoose.Types.ObjectId("dd0000000000000000000001");
//     const reviewId = new mongoose.Types.ObjectId(req.params.id);
//     const { reply } = req.body;

//     if (!reply || !reply.trim()) {
//       return res.status(400).json({ success: false, message: "نص الرد مطلوب" });
//     }

//     const review = await Review.findOneAndUpdate(
//       { _id: reviewId, provider: providerId }, // only own reviews
//       { reply: reply.trim(), repliedAt: new Date() },
//       { new: true }
//     );

//     if (!review) {
//       return res.status(404).json({ success: false, message: "التقييم مش موجود" });
//     }

//     res.status(200).json({ success: true, message: "تم نشر الرد", data: toReviewDTO(review) });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /**
//  * POST /provider/reviews
//  * Create a review for an order.
//  *
//  * ⚠ This is the CUSTOMER action (a customer reviews a completed order),
//  *   placed here for now so you have a way to seed/test data. When your
//  *   customer side is ready, move this handler to a customer route and
//  *   protect it with customer auth instead of provider auth.
//  *
//  * Body: { orderId, rating, comment? }
//  */
// const createReview = async (req, res) => {
//   try {
//     const { orderId, rating, comment } = req.body;

//     if (!orderId || rating === undefined) {
//       return res
//         .status(400)
//         .json({ success: false, message: "رقم الطلب والتقييم مطلوبين" });
//     }
//     if (rating < 1 || rating > 5) {
//       return res
//         .status(400)
//         .json({ success: false, message: "التقييم لازم يكون من 1 لـ 5" });
//     }

//     // Prevent duplicate review for the same order (also enforced by a unique index)
//     const exists = await Review.findOne({ order: orderId });
//     if (exists) {
//       return res
//         .status(409)
//         .json({ success: false, message: "تم تقييم هذا الطلب من قبل" });
//     }

//     // Pull provider/customer/code off the order so we can denormalize them.
//     // ⚠ Adjust the model path and the field names below to match your Order schema.
//     const Order = require("../../models/orderModel");
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "الطلب مش موجود" });
//     }

//     const review = await Review.create({
//       provider: order.provider, // ⚠ adjust to your order's provider field
//       order: order._id,
//       orderCode:
//         order.code || order.orderNumber || order._id.toString(), // ⚠ adjust
//       customer: order.customer || order.user, // ⚠ adjust
//       customerName:
//         order.customerName || req.body.customerName || "عميل", // ⚠ adjust
//       rating,
//       comment: comment || "",
//     });

//     res.status(201).json({
//       success: true,
//       message: "تم إضافة التقييم",
//       data: toReviewDTO(review),
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = {
//   getReviews,
//   replyToReview,
//   createReview,
// };




// controllers/provider/reviewsController.js
const Review = require("../../models/reviewModel");
const Order = require("../../models/orderModel");

function timeAgoAr(date) {
  if (!date) return "";
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "الآن";
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(diff / 3600);
  if (hrs < 24) return `منذ ${hrs} ساعة`;
  const days = Math.floor(diff / 86400);
  if (days === 1) return "منذ يوم";
  if (days === 2) return "منذ يومين";
  if (days < 11) return `منذ ${days} أيام`;
  if (days < 30) return `منذ ${Math.floor(days / 7)} أسابيع`;
  return `منذ ${Math.floor(days / 30)} شهر`;
}

function toReviewDTO(doc) {
  return {
    id: doc._id.toString(),
    customerName: doc.customerName || "عميل",
    rating: doc.rating,
    comment: doc.comment || "",
    orderId: doc.orderCode || (doc.order ? doc.order.toString() : ""),
    date: timeAgoAr(doc.createdAt),
    reply: doc.reply || undefined,
  };
}

const getReviews = async (req, res) => {
  try {
    const providerId = req.shop._id;
    const reviews = await Review.find({ provider: providerId }).sort({ createdAt: -1 });
    const data = reviews.map(toReviewDTO);
    const total = reviews.length;
    const avg = total > 0 ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10 : 0;
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => { counts[r.rating] = (counts[r.rating] || 0) + 1; });
    res.status(200).json({ success: true, count: total, stats: { total, avg, counts }, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const replyToReview = async (req, res) => {
  try {
    const providerId = req.shop._id;
    const { reply } = req.body;
    if (!reply || !reply.trim())
      return res.status(400).json({ success: false, message: "نص الرد مطلوب" });

    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, provider: providerId },
      { reply: reply.trim(), repliedAt: new Date() },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: "التقييم مش موجود" });
    res.status(200).json({ success: true, message: "تم نشر الرد", data: toReviewDTO(review) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { orderId, rating, comment, customerName } = req.body;
    if (!orderId || rating === undefined)
      return res.status(400).json({ success: false, message: "رقم الطلب والتقييم مطلوبين" });
    if (rating < 1 || rating > 5)
      return res.status(400).json({ success: false, message: "التقييم لازم يكون من 1 لـ 5" });

    const exists = await Review.findOne({ order: orderId });
    if (exists) return res.status(409).json({ success: false, message: "تم تقييم هذا الطلب من قبل" });

    const order = await Order.findById(orderId).populate("client", "name fullName");
    if (!order) return res.status(404).json({ success: false, message: "الطلب مش موجود" });

    const review = await Review.create({
      provider: order.provider,
      order: order._id,
      orderCode: order._id.toString(),
      customer: order.client?._id,
      customerName: customerName || order.client?.fullName || order.client?.name || "عميل",
      rating,
      comment: comment || "",
    });

    res.status(201).json({ success: true, message: "تم إضافة التقييم", data: toReviewDTO(review) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getReviews, replyToReview, createReview };