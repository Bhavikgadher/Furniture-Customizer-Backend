// src/modules/dashboard/controller.js
const dashboardService = require('./service');

const getStats = async (req, res, next) => {
  try {
    const result = await dashboardService.getStats();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getSalesChart = async (req, res, next) => {
  try {
    const { period } = req.query;
    const result = await dashboardService.getSalesChart(period);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getConversion = async (req, res, next) => {
  try {
    const result = await dashboardService.getConversion();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getActivity = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const result = await dashboardService.getActivity(limit);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getTopProducts = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const result = await dashboardService.getTopProducts(limit);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getSalesChart,
  getConversion,
  getActivity,
  getTopProducts
};
