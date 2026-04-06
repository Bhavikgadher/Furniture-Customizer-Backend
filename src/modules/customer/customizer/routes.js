// src/modules/customer/customizer/routes.js
const router = require('express').Router();
const controller = require('./controller');
const { authenticate } = require('../../../middlewares/auth');

router.get('/product/:id/options', controller.getProductOptions);
router.post('/calculate-price', controller.calculatePrice);
router.post('/save-design', authenticate, controller.saveDesign);
router.get('/designs', authenticate, controller.listDesigns);
router.get('/designs/:id', authenticate, controller.getDesignById);
router.delete('/designs/:id', authenticate, controller.deleteDesign);

module.exports = router;
