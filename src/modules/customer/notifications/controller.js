// src/modules/customer/notifications/controller.js
const service = require('./service');

const getNotifications = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getNotifications(req.user.id, req.query) }); } catch (e) { next(e); }
};
const markAsRead = async (req, res, next) => {
  try { const r = await service.markAsRead(req.user.id, req.params.id); res.json({ success: true, message: r.message }); } catch (e) { next(e); }
};
const markAllAsRead = async (req, res, next) => {
  try { const r = await service.markAllAsRead(req.user.id); res.json({ success: true, message: r.message }); } catch (e) { next(e); }
};
const getUnreadCount = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getUnreadCount(req.user.id) }); } catch (e) { next(e); }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, getUnreadCount };
