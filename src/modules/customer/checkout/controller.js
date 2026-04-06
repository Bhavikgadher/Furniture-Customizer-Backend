// src/modules/customer/checkout/controller.js
const service = require('./service');

const validateCart = async (req, res, next) => {
  try { res.json({ success: true, data: await service.validateCart(req.user.id) }); } catch (e) { next(e); }
};
const applyCoupon = async (req, res, next) => {
  try { res.json({ success: true, data: await service.applyCoupon(req.user.id, req.body) }); } catch (e) { next(e); }
};
const createOrder = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await service.createOrder(req.user.id, req.body), message: 'Order placed successfully' }); } catch (e) { next(e); }
};

module.exports = { validateCart, applyCoupon, createOrder };
