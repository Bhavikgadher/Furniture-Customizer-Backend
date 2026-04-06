// src/modules/customer/payments/routes.js
const router = require('express').Router();
const controller = require('./controller');
const { authenticate } = require('../../../middlewares/auth');

router.post('/initiate', authenticate, controller.initiatePayment);
router.post('/verify', authenticate, controller.verifyPayment);
router.get('/history', authenticate, controller.getPaymentHistory);

module.exports = router;
