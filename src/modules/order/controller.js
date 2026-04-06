// src/modules/order/controller.js
const orderService = require('./service');

const getStats = async (req, res, next) => {
  try {
    const result = await orderService.getStats();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const listOrders = async (req, res, next) => {
  try {
    const result = await orderService.listOrders(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const result = await orderService.getOrderById(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const result = await orderService.createOrder(req.body);
    res.json({ success: true, data: result, message: 'Order created successfully' });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const result = await orderService.updateOrder(req.params.id, req.body);
    res.json({ success: true, data: result, message: 'Order updated successfully' });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const result = await orderService.updateOrderStatus(req.params.id, req.body.status, req.body.reason);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const result = await orderService.getInvoice(req.params.id);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const exportOrders = async (req, res, next) => {
  try {
    const result = await orderService.exportOrders(req.query);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  listOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  getInvoice,
  exportOrders
};
