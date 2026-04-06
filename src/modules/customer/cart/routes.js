// src/modules/customer/cart/routes.js
const router = require('express').Router();
const controller = require('./controller');
const { authenticate } = require('../../../middlewares/auth');

router.get('/', authenticate, controller.getCart);
router.post('/items', authenticate, controller.addItem);
router.patch('/items/:id', authenticate, controller.updateItem);
router.delete('/items/:id', authenticate, controller.removeItem);
router.delete('/', authenticate, controller.clearCart);

module.exports = router;
