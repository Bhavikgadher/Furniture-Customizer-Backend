// src/modules/customer/orders/controller.js
const service = require('./service');

const listOrders = async (req, res, next) => {
  try { res.json({ success: true, data: await service.listOrders(req.user.id, req.query) }); } catch (e) { next(e); }
};
const getOrderById = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getOrderById(req.user.id, req.params.id) }); } catch (e) { next(e); }
};
const cancelOrder = async (req, res, next) => {
  try { const r = await service.cancelOrder(req.user.id, req.params.id); res.json({ success: true, message: r.message }); } catch (e) { next(e); }
};

module.exports = { listOrders, getOrderById, cancelOrder };
