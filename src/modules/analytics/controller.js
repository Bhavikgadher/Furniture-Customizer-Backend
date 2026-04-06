// src/modules/analytics/controller.js
const analyticsService = require('./service');

const getKPIs = async (req, res, next) => {
  try {
    const result = await analyticsService.getKPIs(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getRevenueChart = async (req, res, next) => {
  try {
    const result = await analyticsService.getRevenueChart(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getSalesByCategory = async (req, res, next) => {
  try {
    const result = await analyticsService.getSalesByCategory(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getVendorPerformance = async (req, res, next) => {
  try {
    const result = await analyticsService.getVendorPerformance(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getUserGrowth = async (req, res, next) => {
  try {
    const result = await analyticsService.getUserGrowth(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const exportAnalytics = async (req, res, next) => {
  try {
    const result = await analyticsService.exportAnalytics(req.query);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKPIs,
  getRevenueChart,
  getSalesByCategory,
  getVendorPerformance,
  getUserGrowth,
  exportAnalytics
};
