// src/modules/adminuser/routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const { listUsersSchema, createUserSchema, updateUserSchema, toggleStatusSchema } = require('./validator');

router.get('/stats', authenticate, controller.getStats);
router.get('/export', authenticate, controller.exportUsers);
router.get('/:id', authenticate, controller.getUserById);
router.get('/', authenticate, validate(listUsersSchema, 'query'), controller.listUsers);
router.post('/', authenticate, validate(createUserSchema), controller.createUser);
router.put('/:id', authenticate, validate(updateUserSchema), controller.updateUser);
router.patch('/:id/status', authenticate, validate(toggleStatusSchema), controller.toggleUserStatus);
router.delete('/:id', authenticate, controller.deleteUser);

module.exports = router;
