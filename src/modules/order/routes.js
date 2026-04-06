// src/modules/order/routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const { 
  listOrdersSchema, 
  createOrderSchema, 
  updateOrderSchema, 
  updateOrderStatusSchema 
} = require('./validator');

router.get('/stats', authenticate, controller.getStats);
router.get('/export', authenticate, controller.exportOrders);
router.get('/:id/invoice', authenticate, controller.getInvoice);
router.get('/:id', authenticate, controller.getOrderById);
router.get('/', authenticate, validate(listOrdersSchema, 'query'), controller.listOrders);
router.post('/', authenticate, validate(createOrderSchema), controller.createOrder);
router.put('/:id', authenticate, validate(updateOrderSchema), controller.updateOrder);
router.patch('/:id/status', authenticate, validate(updateOrderStatusSchema), controller.updateOrderStatus);

module.exports = router;
