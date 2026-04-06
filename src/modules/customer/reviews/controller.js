// src/modules/customer/reviews/controller.js
const service = require('./service');

const createReview = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await service.createReview(req.user.id, req.body), message: 'Review submitted' }); } catch (e) { next(e); }
};
const updateReview = async (req, res, next) => {
  try { res.json({ success: true, data: await service.updateReview(req.user.id, req.params.id, req.body), message: 'Review updated' }); } catch (e) { next(e); }
};
const deleteReview = async (req, res, next) => {
  try { const r = await service.deleteReview(req.user.id, req.params.id); res.json({ success: true, message: r.message }); } catch (e) { next(e); }
};
const getMyReviews = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getMyReviews(req.user.id) }); } catch (e) { next(e); }
};

module.exports = { createReview, updateReview, deleteReview, getMyReviews };
