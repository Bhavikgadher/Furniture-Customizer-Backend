// src/modules/customer/checkout/routes.js
const router = require('express').Router();
const controller = require('./controller');
const { authenticate } = require('../../../middlewares/auth');

router.post('/validate', authenticate, controller.validateCart);
router.post('/apply-coupon', authenticate, controller.applyCoupon);
router.post('/create-order', authenticate, controller.createOrder);

module.exports = router;
