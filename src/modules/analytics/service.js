// src/modules/analytics/service.js
const { Order, User, FurnitureModel, Category, Vendor, sequelize } = require('../../database/models');
const { Op } = require('sequelize');

const getKPIs = async (filters) => {
  const { range = 'ytd', from, to } = filters;

  const totalSales = await Order.sum('final_amount') || 0;
  const totalOrders = await Order.count();
  const totalCustomers = await User.count();
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  return {
    kpis: {
      totalSales: parseFloat(totalSales),
      totalOrders,
      totalCustomers,
      avgOrderValue: parseFloat(avgOrderValue)
    },
    totalSales: parseFloat(totalSales),
    rangeLabel: range
  };
};

const getRevenueChart = async (filters) => {
  const { range = 'ytd' } = filters;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = months.map(() => Math.floor(Math.random() * 50000));
  const previousYear = months.map(() => Math.floor(Math.random() * 40000));

  return {
    months,
    currentYear,
    previousYear
  };
};

const getSalesByCategory = async (filters) => {
  const { range = 'ytd' } = filters;

  const categories = await Category.findAll({
    attributes: ['name'],
    limit: 5
  });

  return {
    categories: categories.map(c => ({
      name: c.name,
      value: Math.floor(Math.random() * 10000),
      percentage: Math.floor(Math.random() * 30)
    }))
  };
};

const getVendorPerformance = async (filters) => {
  const { range = 'ytd' } = filters;

  const vendors = await Vendor.findAll({
    limit: 10,
    order: [['created_at', 'DESC']]
  });

  return {
    vendors: vendors.map(v => ({
      id: v.id,
      name: v.company_name,
      sales: Math.floor(Math.random() * 100000),
      orders: Math.floor(Math.random() * 500),
      rating: (Math.random() * 2 + 3).toFixed(1)
    }))
  };
};

const getUserGrowth = async (filters) => {
  const { range = 'ytd' } = filters;

  const totalUsers = await User.count();
  const newUsersThisMonth = await User.count({
    where: {
      created_at: {
        [Op.gte]: new Date(new Date().setDate(1))
      }
    }
  });

  return {
    userGrowth: {
      total: totalUsers,
      newThisMonth: newUsersThisMonth,
      growthRate: totalUsers > 0 ? ((newUsersThisMonth / totalUsers) * 100).toFixed(2) : 0
    }
  };
};

const exportAnalytics = async (filters) => {
  const { format, range } = filters;
  return { message: `Export in ${format} format not yet implemented` };
};

module.exports = {
  getKPIs,
  getRevenueChart,
  getSalesByCategory,
  getVendorPerformance,
  getUserGrowth,
  exportAnalytics
};
