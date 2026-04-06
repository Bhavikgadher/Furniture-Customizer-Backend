// src/modules/customer/catalog/controller.js
const service = require('./service');

const listProducts = async (req, res, next) => {
  try { res.json({ success: true, data: await service.listProducts(req.query) }); } catch (e) { next(e); }
};
const getProductById = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getProductById(req.params.id) }); } catch (e) { next(e); }
};
const getProductReviews = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getProductReviews(req.params.id, req.query) }); } catch (e) { next(e); }
};
const listCategories = async (req, res, next) => {
  try { res.json({ success: true, data: await service.listCategories() }); } catch (e) { next(e); }
};
const getProductsByCategory = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getProductsByCategory(req.params.id, req.query) }); } catch (e) { next(e); }
};
const searchProducts = async (req, res, next) => {
  try { res.json({ success: true, data: await service.searchProducts(req.query) }); } catch (e) { next(e); }
};
const getFeaturedProducts = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getFeaturedProducts() }); } catch (e) { next(e); }
};
const getVendorStore = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getVendorStore(req.params.id, req.query) }); } catch (e) { next(e); }
};

module.exports = { listProducts, getProductById, getProductReviews, listCategories, getProductsByCategory, searchProducts, getFeaturedProducts, getVendorStore };
