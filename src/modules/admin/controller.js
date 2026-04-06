// src/modules/admin/controller.js
const adminService = require('./service');

const getMe = async (req, res, next) => {
  try {
    const result = await adminService.getMe(req.user.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const globalSearch = async (req, res, next) => {
  try {
    const { q, type, limit } = req.query;
    const result = await adminService.globalSearch(q, type, limit);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const { unread, limit } = req.query;
    const result = await adminService.getNotifications(unread === 'true', limit);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const markAllNotificationsRead = async (req, res, next) => {
  try {
    const result = await adminService.markAllNotificationsRead();
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const markNotificationRead = async (req, res, next) => {
  try {
    const result = await adminService.markNotificationRead(req.params.id);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  globalSearch,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead
};
