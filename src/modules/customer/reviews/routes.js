// src/modules/customer/reviews/routes.js
const router = require('express').Router();
const controller = require('./controller');
const { authenticate } = require('../../../middlewares/auth');

router.get('/my-reviews', authenticate, controller.getMyReviews);
router.post('/', authenticate, controller.createReview);
router.put('/:id', authenticate, controller.updateReview);
router.delete('/:id', authenticate, controller.deleteReview);

module.exports = router;
