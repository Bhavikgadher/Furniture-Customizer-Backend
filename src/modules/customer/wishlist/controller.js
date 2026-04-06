// src/modules/customer/wishlist/controller.js
const service = require('./service');

const getWishlist = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getWishlist(req.user.id) }); } catch (e) { next(e); }
};
const addItem = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await service.addItem(req.user.id, req.body), message: 'Added to wishlist' }); } catch (e) { next(e); }
};
const removeItem = async (req, res, next) => {
  try { const r = await service.removeItem(req.user.id, req.params.id); res.json({ success: true, message: r.message }); } catch (e) { next(e); }
};
const checkItem = async (req, res, next) => {
  try { res.json({ success: true, data: await service.checkItem(req.user.id, req.params.modelId) }); } catch (e) { next(e); }
};

module.exports = { getWishlist, addItem, removeItem, checkItem };
