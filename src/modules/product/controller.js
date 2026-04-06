// src/modules/product/controller.js
const productService = require('./service');

const getStats = async (req, res, next) => {
  try {
    const result = await productService.getStats();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const listProducts = async (req, res, next) => {
  try {
    const result = await productService.listProducts(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const result = await productService.getProductById(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getPendingProducts = async (req, res, next) => {
  try {
    const result = await productService.getPendingProducts(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const result = await productService.createProduct(req.body);
    res.json({ success: true, data: result, message: 'Product created successfully' });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const result = await productService.updateProduct(req.params.id, req.body);
    res.json({ success: true, data: result, message: 'Product updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const approveProduct = async (req, res, next) => {
  try {
    const result = await productService.approveProduct(req.params.id);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const rejectProduct = async (req, res, next) => {
  try {
    const result = await productService.rejectProduct(req.params.id, req.body.reason);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const exportProducts = async (req, res, next) => {
  try {
    const result = await productService.exportProducts(req.query.format);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  listProducts,
  getProductById,
  getPendingProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  approveProduct,
  rejectProduct,
  exportProducts
};
