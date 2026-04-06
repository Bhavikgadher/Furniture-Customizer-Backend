// src/modules/customer/notifications/service.js
const { Notification } = require('../../../database/models');
const { AppError } = require('../../../middlewares/errorHandler');

const getNotifications = async (userId, { page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await Notification.findAndCountAll({
    where: { user_id: userId },
    limit: parseInt(limit), offset, order: [['created_at', 'DESC']]
  });
  return {
    notifications: rows,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: count, totalPages: Math.ceil(count / limit) }
  };
};

const markAsRead = async (userId, notificationId) => {
  const notification = await Notification.findOne({ where: { id: notificationId, user_id: userId } });
  if (!notification) throw new AppError('Notification not found', 'NOT_FOUND', 404);
  await notification.update({ is_read: true });
  return { message: 'Marked as read' };
};

const markAllAsRead = async (userId) => {
  await Notification.update({ is_read: true }, { where: { user_id: userId, is_read: false } });
  return { message: 'All notifications marked as read' };
};

const getUnreadCount = async (userId) => {
  const count = await Notification.count({ where: { user_id: userId, is_read: false } });
  return { unreadCount: count };
};

module.exports = { getNotifications, markAsRead, markAllAsRead, getUnreadCount };
