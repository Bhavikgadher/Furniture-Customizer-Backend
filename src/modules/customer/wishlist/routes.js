// src/modules/customer/wishlist/routes.js
const router = require('express').Router();
const controller = require('./controller');
const { authenticate } = require('../../../middlewares/auth');

router.get('/', authenticate, controller.getWishlist);
router.post('/items', authenticate, controller.addItem);
router.delete('/items/:id', authenticate, controller.removeItem);
router.get('/check/:modelId', authenticate, controller.checkItem);

module.exports = router;
