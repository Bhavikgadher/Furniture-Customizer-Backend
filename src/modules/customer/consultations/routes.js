// src/modules/customer/consultations/routes.js
const router = require('express').Router();
const controller = require('./controller');
const { authenticate } = require('../../../middlewares/auth');

router.get('/designers', controller.listDesigners);
router.post('/book', authenticate, controller.bookConsultation);
router.get('/', authenticate, controller.listConsultations);
router.get('/:id', authenticate, controller.getConsultationById);
router.post('/:id/cancel', authenticate, controller.cancelConsultation);

module.exports = router;
