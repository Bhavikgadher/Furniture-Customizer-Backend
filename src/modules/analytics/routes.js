// src/modules/analytics/routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticate } = require('../../middlewares/auth');

router.get('/kpis', authenticate, controller.getKPIs);
router.get('/revenue-chart', authenticate, controller.getRevenueChart);
router.get('/sales-by-category', authenticate, controller.getSalesByCategory);
router.get('/vendor-performance', authenticate, controller.getVendorPerformance);
router.get('/user-growth', authenticate, controller.getUserGrowth);
router.get('/export', authenticate, controller.exportAnalytics);

module.exports = router;
