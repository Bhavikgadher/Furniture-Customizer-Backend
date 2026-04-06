// src/modules/vendor/routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const { listVendorsSchema, createVendorSchema } = require('./validator');

router.get('/stats', authenticate, controller.getStats);
router.get('/applications', authenticate, controller.getApplications);
router.get('/export', authenticate, controller.exportVendors);
router.get('/:id', authenticate, controller.getVendorById);
router.get('/', authenticate, validate(listVendorsSchema, 'query'), controller.listVendors);
router.post('/', authenticate, validate(createVendorSchema), controller.createVendor);
router.post('/invite', authenticate, controller.inviteVendor);
router.patch('/applications/:id/approve', authenticate, controller.approveApplication);
router.patch('/applications/:id/reject', authenticate, controller.rejectApplication);
router.put('/:id', authenticate, controller.updateVendor);
router.patch('/:id/status', authenticate, controller.toggleVendorStatus);

module.exports = router;
