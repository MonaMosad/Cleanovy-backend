// // src/routes/order.routes.js
// const express = require("express");
// const {
//   placeOrder,
//   getOrderDetails,
//   updateOrderStatus,
//   updateSchedule,
//   getCurrentOrders,
//   getOrderHistory,
//   getAllOrders,
//   getAllOrdersForAdmin,
// } = require("../controllers/orderController.js");
// const router = express.Router();
// //TEST
// router.get("/test", (req, res) => {
//   res.json({ message: "orders route works" });
// });
// console.log("ORDER ROUTES LOADED");


// // ══════════════════════════════════════════════════════════════
// //  ملاحظة Auth Mock:
// //  بعد الدمج مع Dev 1 أضف middleware الحماية على المسارات هكذا:
// //
// //  import { protect } from "../middlewares/auth.middleware.js";
// //  router.use(protect);           ← يحمي كل المسارات دفعة واحدة
// //
// //  أو على كل مسار منفرداً:
// //  router.post("/", protect, placeOrder);
// // ══════════════════════════════════════════════════════════════

// // ── الطلبات ──────────────────────────────────────────────────
// router.post("/",placeOrder);        // إنشاء طلب جديد
// router.get("/me/current",getCurrentOrders); // الطلبات النشطة
// router.get("/me/history",getOrderHistory);  // سجل الطلبات
// router.get("/me/all",getAllOrders);       // كل الطلبات (للعميل)
// router.get("/admin/all",getAllOrdersForAdmin); // كل الطلبات (للمسؤول)
// // ── طلب واحد ─────────────────────────────────────────────────
// router.get("/:id",getOrderDetails);    // تفاصيل طلب
// router.patch("/:id/status",updateOrderStatus);  // تحديث الحالة
// router.patch("/:id/schedule",updateSchedule);     // تعديل المواعيد

// module.exports = router;
// src/routes/index.js
// ══════════════════════════════════════════════════════════════
//  Routes — كل الـ endpoints الجديدة
// ══════════════════════════════════════════════════════════════
const express = require("express");

// Controllers
const {
  placeOrder,
  getOrderDetails,
  updateOrderStatus,
  updateSchedule,
  getCurrentOrders,
  getOrderHistory,
  getAllOrders,
  getAllOrdersForAdmin,
} = require("../controllers/orderController.js");

// const {
//   createCoupon,
//   validateCoupon,
//   getMyCoupons,
//   toggleCoupon,
//   deleteCoupon,
// } = require("../controllers/couponController.js");

const {
  payOrder,
  paySettlement,
  getMySettlements,
  getAllSettlementsAdmin,
} = require("../controllers/paymentController.js");

const router = express.Router();

// ══════════════════════════════════════════════════════════════
//  ORDER ROUTES
// ══════════════════════════════════════════════════════════════
// POST   /api/orders                  → إنشاء طلب (يشمل coupon + payment_method)
// GET    /api/orders/me/current       → طلباتي النشطة
// GET    /api/orders/me/history       → سجل طلباتي
// GET    /api/orders/me/all           → كل طلباتي
// GET    /api/orders/admin/all        → أدمن: كل الطلبات
// GET    /api/orders/:id              → تفاصيل طلب
// PATCH  /api/orders/:id/status       → تحديث حالة (provider)
// PATCH  /api/orders/:id/schedule     → تعديل المواعيد

router.post  ("/",                placeOrder);
router.get   ("/me/current",     getCurrentOrders);
router.get   ("/me/history",     getOrderHistory);
router.get   ("/me/all",         getAllOrders);
router.get   ("/admin/all",      getAllOrdersForAdmin);
router.get   ("/:id",            getOrderDetails);
router.patch ("/:id/status",     updateOrderStatus);
router.patch ("/:id/schedule",   updateSchedule);

// ══════════════════════════════════════════════════════════════
//  COUPON ROUTES
// ══════════════════════════════════════════════════════════════
// POST   /api/coupons                 → Provider ينشئ كوبون
// POST   /api/coupons/validate        → Client يتحقق من كوبون
// GET    /api/coupons/my              → Provider يشوف كوباناته
// PATCH  /api/coupons/:id/toggle      → Provider يفعّل/يعطّل كوبون
// DELETE /api/coupons/:id             → Provider يحذف كوبون


// ══════════════════════════════════════════════════════════════
//  PAYMENT ROUTES
// ══════════════════════════════════════════════════════════════
// POST   /api/payments/pay/:orderId               → Client يدفع أوردر
// POST   /api/payments/settlement/:id/pay         → Provider يدفع عمولة متراكمة
// GET    /api/payments/settlements/my             → Provider يشوف settlementsه
// GET    /api/payments/settlements/admin/all      → أدمن يشوف كل الـ settlements

router.post ("/pay/:orderId",   payOrder);
router.post ("/settlement/:settlementId/pay", paySettlement);
router.get  ("/settlements/my",            getMySettlements);
router.get  ("/settlements/admin/all",     getAllSettlementsAdmin);

module.exports = router;
