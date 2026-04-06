// src/modules/customer/profile/routes.js
const router = require('express').Router();
const controller = require('./controller');
const { authenticate } = require('../../../middlewares/auth');

router.get('/', authenticate, controller.getProfile);
router.put('/', authenticate, controller.updateProfile);
router.put('/change-password', authenticate, controller.changePassword);
router.get('/addresses', authenticate, controller.listAddresses);
router.post('/addresses', authenticate, controller.addAddress);
router.put('/addresses/:id', authenticate, controller.updateAddress);
router.delete('/addresses/:id', authenticate, controller.deleteAddress);
router.patch('/addresses/:id/default', authenticate, controller.setDefaultAddress);

module.exports = router;
