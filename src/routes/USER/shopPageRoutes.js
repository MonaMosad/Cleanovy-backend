const router = require("express").Router();
const ctrl   = require("../../controllers/USER/shopPageController");

// Shop info
router.get("/shops/:id",             ctrl.getShop);
router.get("/shops/:id/services",    ctrl.getShopServices);   // ?category=
router.get("/shops/:id/categories",  ctrl.getShopCategories);
router.get("/shops/:id/reviews",     ctrl.getShopReviews);
router.post("/shops/:id/reviews",    ctrl.createReview);

// Cart & Orders
router.post("/cart/calculate",       ctrl.calculateCart);
router.post("/orders",               ctrl.placeOrder);

module.exports = router;
