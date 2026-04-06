// src/modules/coupon/controller.js
const couponService = require('./service');

const getStats = async (req, res, next) => {
  try {
    const result = await couponService.getStats();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const listCoupons = async (req, res, next) => {
  try {
    const result = await couponService.listCoupons(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getCouponById = async (req, res, next) => {
  try {
    const result = await couponService.getCouponById(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const createCoupon = async (req, res, next) => {
  try {
    const result = await couponService.createCoupon(req.body);
    res.json({ success: true, data: result, message: 'Coupon created successfully' });
  } catch (error) {
    next(error);
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    const result = await couponService.updateCoupon(req.params.id, req.body);
    res.json({ success: true, data: result, message: 'Coupon updated successfully' });
  } catch (error) {
    next(error);
  }
};

const toggleCouponVisibility = async (req, res, next) => {
  try {
    const result = await couponService.toggleCouponVisibility(req.params.id, req.body.isVisible);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    const result = await couponService.deleteCoupon(req.params.id);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const exportCoupons = async (req, res, next) => {
  try {
    const result = await couponService.exportCoupons(req.query.format);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  listCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  toggleCouponVisibility,
  deleteCoupon,
  exportCoupons
};
