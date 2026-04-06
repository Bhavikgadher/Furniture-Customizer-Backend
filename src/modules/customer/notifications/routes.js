// src/modules/customer/notifications/routes.js
const router = require('express').Router();
const controller = require('./controller');
const { authenticate } = require('../../../middlewares/auth');

router.get('/', authenticate, controller.getNotifications);
router.get('/unread-count', authenticate, controller.getUnreadCount);
router.patch('/:id/read', authenticate, controller.markAsRead);
router.patch('/read-all', authenticate, controller.markAllAsRead);

module.exports = router;
