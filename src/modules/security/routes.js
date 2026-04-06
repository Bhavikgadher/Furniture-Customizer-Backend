// src/modules/security/routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticate } = require('../../middlewares/auth');

router.get('/stats', authenticate, controller.getStats);
router.get('/roles', authenticate, controller.listRoles);
router.post('/roles', authenticate, controller.createRole);
router.put('/roles/:id', authenticate, controller.updateRole);
router.delete('/roles/:id', authenticate, controller.deleteRole);
router.get('/audit-logs', authenticate, controller.getAuditLogs);
router.get('/audit-logs/export', authenticate, controller.exportAuditLogs);
router.get('/user-assignments', authenticate, controller.getUserAssignments);

module.exports = router;
