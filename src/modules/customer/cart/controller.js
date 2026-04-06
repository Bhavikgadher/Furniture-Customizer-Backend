// src/modules/customer/cart/controller.js
const service = require('./service');

const getCart = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getCart(req.user.id) }); } catch (e) { next(e); }
};
const addItem = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await service.addItem(req.user.id, req.body), message: 'Item added to cart' }); } catch (e) { next(e); }
};
const updateItem = async (req, res, next) => {
  try { res.json({ success: true, data: await service.updateItem(req.user.id, req.params.id, req.body), message: 'Cart updated' }); } catch (e) { next(e); }
};
const removeItem = async (req, res, next) => {
  try { const r = await service.removeItem(req.user.id, req.params.id); res.json({ success: true, message: r.message }); } catch (e) { next(e); }
};
const clearCart = async (req, res, next) => {
  try { const r = await service.clearCart(req.user.id); res.json({ success: true, message: r.message }); } catch (e) { next(e); }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
