// في كل route file
// router.use(authMiddleware);        // التحقق من التوكن
// router.use(providerOnlyMiddleware); // التحقق إنه provider مش client


const express = require('express');
const router = express.Router();


const discountsController = require('../../controllers/provider/ordersController');

router.get('/', discountsController.getDiscounts);

module.exports = router;