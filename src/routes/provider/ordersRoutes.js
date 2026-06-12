

// في كل route file
// router.use(authMiddleware);        // التحقق من التوكن
// router.use(providerOnlyMiddleware); // التحقق إنه provider مش client


const express = require('express');
const router = express.Router();
const ordersController = require('../../controllers/provider/ordersController');

router.get('/', ordersController.getOrders);
router.get('/:id', ordersController.getOrderById);
router.post("/:orderId/accept", ordersController.acceptOrder);
router.post('/:orderId/reject', ordersController.rejectOrder);
router.patch('/:orderId/status', ordersController.updateOrderStatus);
router.get('/report/today', ordersController.getTodayReport);






module.exports = router;


