// src/modules/admin/routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticate } = require('../../middlewares/auth');

router.get('/me', authenticate, controller.getMe);
router.get('/search', authenticate, controller.globalSearch);
router.get('/notifications', authenticate, controller.getNotifications);
router.patch('/notifications/mark-all-read', authenticate, controller.markAllNotificationsRead);
router.patch('/notifications/:id/read', authenticate, controller.markNotificationRead);

module.exports = router;
