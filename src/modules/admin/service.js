// src/modules/admin/service.js
const { User, Role, Order, FurnitureModel, Vendor } = require('../../database/models');
const { Op } = require('sequelize');
const { AppError } = require('../../middlewares/errorHandler');

const getMe = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [{ model: Role, as: 'role' }]
  });

  if (!user) {
    throw new AppError('User not found', 'USER_NOT_FOUND', 404);
  }

  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    role: user.role.name,
    avatar: null,
    permissions: []
  };
};

const globalSearch = async (query, type = 'all', limit = 10) => {
  const results = [];
  let totalCount = 0;

  if (type === 'all' || type === 'orders') {
    const orders = await Order.findAll({
      where: {
        id: { [Op.iLike]: `%${query}%` }
      },
      limit: parseInt(limit),
      include: [{ model: User, as: 'customer', attributes: ['full_name'] }]
    });
    
    results.push(...orders.map(o => ({
      type: 'order',
      id: o.id,
      title: `Order ${o.id.substring(0, 8)}`,
      subtitle: o.customer?.full_name || 'N/A'
    })));
    totalCount += orders.length;
  }

  if (type === 'all' || type === 'products') {
    const products = await FurnitureModel.findAll({
      where: {
        name: { [Op.iLike]: `%${query}%` }
      },
      limit: parseInt(limit)
    });
    
    results.push(...products.map(p => ({
      type: 'product',
      id: p.id,
      title: p.name,
      subtitle: `$${p.base_price}`
    })));
    totalCount += products.length;
  }

  if (type === 'all' || type === 'users') {
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { full_name: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } }
        ]
      },
      limit: parseInt(limit)
    });
    
    results.push(...users.map(u => ({
      type: 'user',
      id: u.id,
      title: u.full_name,
      subtitle: u.email
    })));
    totalCount += users.length;
  }

  if (type === 'all' || type === 'vendors') {
    const vendors = await Vendor.findAll({
      where: {
        company_name: { [Op.iLike]: `%${query}%` }
      },
      limit: parseInt(limit)
    });
    
    results.push(...vendors.map(v => ({
      type: 'vendor',
      id: v.id,
      title: v.company_name,
      subtitle: v.is_approved ? 'Approved' : 'Pending'
    })));
    totalCount += vendors.length;
  }

  return {
    results: results.slice(0, limit),
    totalCount
  };
};

const getNotifications = async (unread = false, limit = 10) => {
  return {
    notifications: [],
    unreadCount: 0
  };
};

const markAllNotificationsRead = async () => {
  return { message: 'All notifications marked as read' };
};

const markNotificationRead = async (notificationId) => {
  return { message: 'Notification marked as read' };
};

module.exports = {
  getMe,
  globalSearch,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead
};
