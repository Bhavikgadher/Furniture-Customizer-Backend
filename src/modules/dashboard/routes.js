// src/modules/dashboard/routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticate } = require('../../middlewares/auth');

router.get('/stats', authenticate, controller.getStats);
router.get('/sales-chart', authenticate, controller.getSalesChart);
router.get('/conversion', authenticate, controller.getConversion);
router.get('/activity', authenticate, controller.getActivity);
router.get('/top-products', authenticate, controller.getTopProducts);

module.exports = router;
