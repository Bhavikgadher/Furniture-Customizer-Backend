// src/routes.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./modules/auth/routes');
const adminRoutes = require('./modules/admin/routes');
const dashboardRoutes = require('./modules/dashboard/routes');
const adminUserRoutes = require('./modules/adminuser/routes');
const vendorRoutes = require('./modules/vendor/routes');
const categoryRoutes = require('./modules/category/routes');
const productRoutes = require('./modules/product/routes');
const orderRoutes = require('./modules/order/routes');
const couponRoutes = require('./modules/coupon/routes');
const securityRoutes = require('./modules/security/routes');
const analyticsRoutes = require('./modules/analytics/routes');
const utilityRoutes = require('./modules/utility/routes');

// Customer routes
const customerAuthRoutes = require('./modules/customer/auth/routes');
const customerProfileRoutes = require('./modules/customer/profile/routes');
const customerCatalogRoutes = require('./modules/customer/catalog/routes');
const customerCustomizerRoutes = require('./modules/customer/customizer/routes');
const customerCartRoutes = require('./modules/customer/cart/routes');
const customerCheckoutRoutes = require('./modules/customer/checkout/routes');
const customerOrderRoutes = require('./modules/customer/orders/routes');
const customerPaymentRoutes = require('./modules/customer/payments/routes');
const customerReviewRoutes = require('./modules/customer/reviews/routes');
const customerWishlistRoutes = require('./modules/customer/wishlist/routes');
const customerConsultationRoutes = require('./modules/customer/consultations/routes');
const customerNotificationRoutes = require('./modules/customer/notifications/routes');

// Admin routes
router.use('/api/auth', authRoutes);
router.use('/api/admin/dashboard', dashboardRoutes);
router.use('/api/admin/users', adminUserRoutes);
router.use('/api/admin/vendors', vendorRoutes);
router.use('/api/admin/categories', categoryRoutes);
router.use('/api/admin/products', productRoutes);
router.use('/api/admin/orders', orderRoutes);
router.use('/api/admin/coupons', couponRoutes);
router.use('/api/admin/security', securityRoutes);
router.use('/api/admin/analytics', analyticsRoutes);
router.use('/api/admin', utilityRoutes);
router.use('/api/admin', adminRoutes);

// Customer routes
router.use('/api/customer/auth', customerAuthRoutes);
router.use('/api/customer/profile', customerProfileRoutes);
router.use('/api/customer/catalog', customerCatalogRoutes);
router.use('/api/customer/customizer', customerCustomizerRoutes);
router.use('/api/customer/cart', customerCartRoutes);
router.use('/api/customer/checkout', customerCheckoutRoutes);
router.use('/api/customer/orders', customerOrderRoutes);
router.use('/api/customer/payments', customerPaymentRoutes);
router.use('/api/customer/reviews', customerReviewRoutes);
router.use('/api/customer/wishlist', customerWishlistRoutes);
router.use('/api/customer/consultations', customerConsultationRoutes);
router.use('/api/customer/notifications', customerNotificationRoutes);

module.exports = router;
