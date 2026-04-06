// src/modules/customer/orders/routes.js
const router = require('express').Router();
const controller = require('./controller');
const { authenticate } = require('../../../middlewares/auth');

router.get('/', authenticate, controller.listOrders);
router.get('/:id', authenticate, controller.getOrderById);
router.post('/:id/cancel', authenticate, controller.cancelOrder);

module.exports = router;
