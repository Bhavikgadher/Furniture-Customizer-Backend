// src/modules/dashboard/service.js
const { User, Order, FurnitureModel, Vendor, sequelize } = require('../../database/models');
const { Op } = require('sequelize');

const getStats = async () => {
  const totalUsers = await User.count();
  const totalOrders = await Order.count();
  const totalRevenue = await Order.sum('final_amount') || 0;
  const totalProducts = await FurnitureModel.count();

  return {
    stats: {
      totalUsers,
      totalOrders,
      totalRevenue: parseFloat(totalRevenue),
      totalProducts
    }
  };
};

const getSalesChart = async (period = 'daily') => {
  const now = new Date();
  const labels = [];
  const datasets = [];

  if (period === 'daily') {
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      labels.push(date.toISOString().split('T')[0]);
    }
  } else {
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      labels.push(date.toISOString().substring(0, 7));
    }
  }

  return {
    period,
    labels,
    datasets: [
      {
        label: 'Sales',
        data: labels.map(() => Math.floor(Math.random() * 10000))
      }
    ]
  };
};

const getConversion = async () => {
  return {
    conversionMetrics: {
      visitorsToLeads: 45,
      leadsToCustomers: 30,
      overallConversion: 13.5
    }
  };
};

const getActivity = async (limit = 5) => {
  const recentOrders = await Order.findAll({
    limit: parseInt(limit),
    order: [['created_at', 'DESC']],
    include: [{ model: User, as: 'customer', attributes: ['full_name'] }]
  });

  return {
    activities: recentOrders.map(order => ({
      id: order.id,
      type: 'order',
      description: `New order from ${order.customer?.full_name || 'Unknown'}`,
      amount: parseFloat(order.final_amount),
      timestamp: order.created_at
    }))
  };
};

const getTopProducts = async (limit = 5) => {
  const products = await FurnitureModel.findAll({
    limit: parseInt(limit),
    order: [['created_at', 'DESC']]
  });

  return {
    products: products.map(p => ({
      id: p.id,
      name: p.name,
      sales: Math.floor(Math.random() * 100),
      revenue: parseFloat(p.base_price) * Math.floor(Math.random() * 100)
    }))
  };
};

module.exports = {
  getStats,
  getSalesChart,
  getConversion,
  getActivity,
  getTopProducts
};
