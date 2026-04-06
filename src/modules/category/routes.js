// src/modules/category/routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const { createCategorySchema, updateCategorySchema } = require('./validator');

router.get('/tree', authenticate, controller.getCategoryTree);
router.get('/:id', authenticate, controller.getCategoryById);
router.get('/', authenticate, controller.listCategories);
router.post('/', authenticate, validate(createCategorySchema), controller.createCategory);
router.put('/:id', authenticate, validate(updateCategorySchema), controller.updateCategory);
router.delete('/:id', authenticate, controller.deleteCategory);

module.exports = router;
