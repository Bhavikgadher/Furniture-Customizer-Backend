// src/modules/product/routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const { createProductSchema } = require('./validator');

router.get('/stats', authenticate, controller.getStats);
router.get('/pending', authenticate, controller.getPendingProducts);
router.get('/export', authenticate, controller.exportProducts);
router.get('/:id', authenticate, controller.getProductById);
router.get('/', authenticate, controller.listProducts);
router.post('/', authenticate, validate(createProductSchema), controller.createProduct);
router.put('/:id', authenticate, controller.updateProduct);
router.delete('/:id', authenticate, controller.deleteProduct);
router.patch('/pending/:id/approve', authenticate, controller.approveProduct);
router.patch('/pending/:id/reject', authenticate, controller.rejectProduct);

module.exports = router;
