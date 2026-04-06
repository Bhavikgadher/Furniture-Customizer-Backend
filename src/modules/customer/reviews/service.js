// src/modules/customer/reviews/service.js
const { Review, FurnitureModel } = require('../../../database/models');
const { AppError } = require('../../../middlewares/errorHandler');

const createReview = async (userId, { model_id, rating, comment }) => {
  if (!model_id) throw new AppError('model_id is required', 'VALIDATION_ERROR', 400);
  if (!rating) throw new AppError('rating is required', 'VALIDATION_ERROR', 400);

  const existing = await Review.findOne({ where: { user_id: userId, model_id } });
  if (existing) throw new AppError('You have already reviewed this product', 'ALREADY_REVIEWED', 400);

  if (rating < 1 || rating > 5) throw new AppError('Rating must be between 1 and 5', 'INVALID_RATING', 400);

  const review = await Review.create({ user_id: userId, model_id, rating, comment, is_approved: false });
  return { review: { id: review.id, rating: review.rating, comment: review.comment, createdAt: review.created_at } };
};

const updateReview = async (userId, reviewId, { rating, comment }) => {
  const review = await Review.findOne({ where: { id: reviewId, user_id: userId } });
  if (!review) throw new AppError('Review not found', 'REVIEW_NOT_FOUND', 404);
  const data = {};
  if (rating) { if (rating < 1 || rating > 5) throw new AppError('Rating must be between 1 and 5', 'INVALID_RATING', 400); data.rating = rating; }
  if (comment !== undefined) data.comment = comment;
  data.is_approved = false; // reset approval on edit
  await review.update(data);
  return { review };
};

const deleteReview = async (userId, reviewId) => {
  const review = await Review.findOne({ where: { id: reviewId, user_id: userId } });
  if (!review) throw new AppError('Review not found', 'REVIEW_NOT_FOUND', 404);
  await review.destroy();
  return { message: 'Review deleted successfully' };
};

const getMyReviews = async (userId) => {
  const reviews = await Review.findAll({
    where: { user_id: userId },
    include: [{ model: FurnitureModel, foreignKey: 'model_id', attributes: ['id', 'name', 'base_image'] }],
    order: [['created_at', 'DESC']]
  });
  return { reviews };
};

module.exports = { createReview, updateReview, deleteReview, getMyReviews };
