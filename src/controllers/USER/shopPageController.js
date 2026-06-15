const LaundryShop     = require("../../models/laundryShopModel");
const ProviderService = require("../../models/providerServiceModel");
const Review          = require("../../models/reviewModel");
const GuestReview     = require("../../models/guestReviewModel");
const UserOrder       = require("../../models/userOrderModel");
const { priceCart }   = require("../../utils/userFlowPricing");

const round2 = (n) => parseFloat((n || 0).toFixed(2));

// ── Map a ProviderService doc → flat shape for the frontend ──────────────────
function mapService(ps) {
  const fastMultiplier = ps.fast_multiplier || 1;
  const fastService    = !!ps.fast_service;
  return {
    _id:             ps._id,
    name:            ps.name || ps.service?.name || "خدمة",
    image:           ps.service?.image || null,
    price:           ps.price,
    fast_price:      fastService ? round2(ps.price * fastMultiplier) : null,
    unit:            ps.unit || ps.service?.unit || "per_piece",
    category:        ps.category || ps.service?.parent?.name || "عام",
    is_active:       ps.is_active,
    fast_multiplier: fastMultiplier,
    fast_service:    fastService,
  };
}

// ── GET /api/page/shops/:id ──────────────────────────────────────────────────
exports.getShop = async (req, res) => {
  try {
    const shop = await LaundryShop.findById(req.params.id).lean();
    if (!shop) return res.status(404).json({ success: false, message: "المغسلة غير موجودة" });

    const stats = await Review.aggregate([
      { $match: { provider: shop._id, is_hidden: { $ne: true } } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        ...shop,
        avg_rating:    stats[0] ? parseFloat(stats[0].avg.toFixed(1)) : null,
        total_reviews: stats[0]?.count || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/page/shops/:id/services ────────────────────────────────────────
exports.getShopServices = async (req, res) => {
  try {
    const { category } = req.query;

    const ps = await ProviderService.find({ provider: req.params.id, is_active: true })
      .populate({ path: "service", populate: { path: "parent", select: "name" } })
      .lean();

    let list = ps.map(mapService);

    if (category && category !== "الكل" && category.toLowerCase() !== "all") {
      list = list.filter(s => s.category === category);
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/page/shops/:id/categories ──────────────────────────────────────
exports.getShopCategories = async (req, res) => {
  try {
    const ps = await ProviderService.find({ provider: req.params.id, is_active: true })
      .populate({ path: "service", populate: { path: "parent", select: "name" } })
      .lean();

    const list = ps.map(mapService);
    const counts = {};
    for (const s of list) {
      counts[s.category] = (counts[s.category] || 0) + 1;
    }

    const categories = [
      { name: "الكل", count: list.length },
      ...Object.entries(counts).map(([name, count]) => ({ name, count })),
    ];

    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/page/shops/:id/reviews ─────────────────────────────────────────
// Returns both authenticated reviews + guest reviews, merged by date
exports.getShopReviews = async (req, res) => {
  try {
    const shop = await LaundryShop.findById(req.params.id).lean();
    if (!shop) return res.status(404).json({ success: false, message: "المغسلة غير موجودة" });

    const [authReviews, guestReviews] = await Promise.all([
      Review.find({ provider: shop._id, is_hidden: { $ne: true } })
        .populate("client", "fullName avatar")
        .sort({ createdAt: -1 })
        .lean(),
      GuestReview.find({ provider: shop._id, is_hidden: { $ne: true } })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const mapped = [
      ...authReviews.map(r => ({
        _id:            r._id,
        rating:         r.rating,
        comment:        r.comment,
        provider_reply: r.provider_reply,
        createdAt:      r.createdAt,
        client:         r.client?.fullName || "مجهول",
        avatar:         r.client?.avatar || null,
      })),
      ...guestReviews.map(r => ({
        _id:            r._id,
        rating:         r.rating,
        comment:        r.comment,
        provider_reply: r.provider_reply,
        createdAt:      r.createdAt,
        client:         r.clientName || "زائر",
        avatar:         null,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ success: true, count: mapped.length, data: mapped });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/page/shops/:id/reviews ────────────────────────────────────────
exports.createReview = async (req, res) => {
  try {
    const { rating, comment, clientName } = req.body;

    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ success: false, message: "rating مطلوب ويجب أن يكون بين 1 و 5" });
    if (!comment || !comment.trim())
      return res.status(400).json({ success: false, message: "التعليق مطلوب" });

    const shop = await LaundryShop.findById(req.params.id).lean();
    if (!shop) return res.status(404).json({ success: false, message: "المغسلة غير موجودة" });

    const review = await GuestReview.create({
      provider:   shop._id,
      rating,
      comment:    comment.trim(),
      clientName: (clientName || "زائر").trim(),
    });

    res.status(201).json({
      success: true,
      data: {
        _id:            review._id,
        rating:         review.rating,
        comment:        review.comment,
        provider_reply: null,
        createdAt:      review.createdAt,
        client:         review.clientName,
        avatar:         null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/page/cart/calculate ───────────────────────────────────────────
exports.calculateCart = async (req, res) => {
  try {
    const { items, deliveryFee = 0 } = req.body;
    if (!Array.isArray(items) || !items.length)
      return res.status(400).json({ success: false, message: "items مطلوب" });

    const priced = await priceCart(items, { deliveryFee });
    res.json({ success: true, data: priced });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/page/orders ────────────────────────────────────────────────────
exports.placeOrder = async (req, res) => {
  try {
    const { shopId, customerName, phone, address, notes,
            paymentMethod, deliveryFee = 0, items } = req.body;

    console.log("[placeOrder] body:", JSON.stringify({ shopId, paymentMethod, deliveryFee, itemsCount: items?.length }));

    if (!shopId)        return res.status(400).json({ success: false, message: "shopId مطلوب" });
    if (!items?.length) return res.status(400).json({ success: false, message: "items مطلوب" });

    const shop = await LaundryShop.findById(shopId);
    if (!shop) return res.status(404).json({ success: false, message: "المغسلة غير موجودة" });

    const priced = await priceCart(items, { deliveryFee });
    console.log("[placeOrder] priced lineItems:", priced.lineItems.length, "total:", priced.total);

    if (!priced.lineItems.length)
      return res.status(400).json({ success: false, message: "لا توجد عناصر صالحة في الطلب — تأكد من صحة الـ serviceIds" });

    const order = await UserOrder.create({
      shop:         shopId,
      customerName, phone, address, notes,
      paymentMethod: paymentMethod || "cash",
      items: priced.lineItems.map(li => ({
        providerService: li.providerService,
        serviceName:     li.name,
        price:           li.unitPrice,
        quantity:        li.quantity,
        fast:            li.fast,
        lineTotal:       li.lineTotal,
      })),
      subtotal:     priced.subtotal,
      discountRate: priced.discountRate,
      discount:     priced.discount,
      vat:          priced.vat,
      deliveryFee:  priced.deliveryFee,
      total_price:  priced.total,
      currency:     priced.currency,
    });

    console.log("[placeOrder] ✅ order created:", order._id, "orderNumber:", order.orderNumber);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    console.error("[placeOrder] ❌ error:", err.message, "\n", err.stack);
    res.status(500).json({ success: false, message: err.message, stack: process.env.NODE_ENV === "development" ? err.stack : undefined });
  }
};
