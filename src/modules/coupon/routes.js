// src/modules/coupon/routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const { createCouponSchema } = require('./validator');

router.get('/stats', authenticate, controller.getStats);
router.get('/export', authenticate, controller.exportCoupons);
router.get('/:id', authenticate, controller.getCouponById);
router.get('/', authenticate, controller.listCoupons);
router.post('/', authenticate, validate(createCouponSchema), controller.createCoupon);
router.put('/:id', authenticate, controller.updateCoupon);
router.patch('/:id/visibility', authenticate, controller.toggleCouponVisibility);
router.delete('/:id', authenticate, controller.deleteCoupon);

module.exports = router;
