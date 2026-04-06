// src/modules/category/controller.js
const categoryService = require('./service');

const listCategories = async (req, res, next) => {
  try {
    const result = await categoryService.listCategories(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const result = await categoryService.getCategoryById(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const result = await categoryService.createCategory(req.body);
    res.json({ success: true, data: result, message: 'Category created successfully' });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const result = await categoryService.updateCategory(req.params.id, req.body);
    res.json({ success: true, data: result, message: 'Category updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const getCategoryTree = async (req, res, next) => {
  try {
    const result = await categoryService.getCategoryTree();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree
};
