// src/modules/customer/catalog/routes.js
const router = require('express').Router();
const controller = require('./controller');

router.get('/products', controller.listProducts);
router.get('/products/:id', controller.getProductById);
router.get('/products/:id/reviews', controller.getProductReviews);
router.get('/categories', controller.listCategories);
router.get('/categories/:id/products', controller.getProductsByCategory);
router.get('/search', controller.searchProducts);
router.get('/featured', controller.getFeaturedProducts);
router.get('/vendor/:id', controller.getVendorStore);

module.exports = router;
