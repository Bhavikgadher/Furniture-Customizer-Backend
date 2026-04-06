// src/modules/coupon/service.js
const { Coupon, CouponUsage } = require('../../database/models');
const { Op } = require('sequelize');
const { AppError } = require('../../middlewares/errorHandler');

const getStats = async () => {
  const total = await Coupon.count();
  const active = await Coupon.count({
    where: {
      expiry_date: { [Op.gt]: new Date() }
    }
  });
  const expired = await Coupon.count({
    where: {
      expiry_date: { [Op.lte]: new Date() }
    }
  });

  return {
    stats: {
      total,
      active,
      expired
    }
  };
};

const listCoupons = async (filters) => {
  const { tab = 'all', search, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  const where = {};
  
  if (tab === 'active') {
    where.expiry_date = { [Op.gt]: new Date() };
  } else if (tab === 'expired') {
    where.expiry_date = { [Op.lte]: new Date() };
  }

  if (search) {
    where.code = { [Op.iLike]: `%${search}%` };
  }

  const { count, rows } = await Coupon.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']]
  });

  return {
    coupons: rows.map(c => ({
      id: c.id,
      code: c.code,
      discountType: c.discount_type,
      discountValue: parseFloat(c.value),
      expiryDate: c.expiry_date,
      usageLimit: c.usage_limit,
      isExpired: c.expiry_date ? new Date(c.expiry_date) < new Date() : false,
      createdAt: c.created_at
    })),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
};

const getCouponById = async (couponId) => {
  const coupon = await Coupon.findByPk(couponId);

  if (!coupon) {
    throw new AppError('Coupon not found', 'COUPON_NOT_FOUND', 404);
  }

  const usageCount = await CouponUsage.count({ where: { coupon_id: couponId } });

  return {
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discount_type,
      discountValue: parseFloat(coupon.value),
      maxDiscount: coupon.max_discount ? parseFloat(coupon.max_discount) : null,
      minOrderValue: coupon.min_order_value ? parseFloat(coupon.min_order_value) : null,
      expiryDate: coupon.expiry_date,
      usageLimit: coupon.usage_limit,
      usageCount,
      createdAt: coupon.created_at
    }
  };
};

const createCoupon = async (couponData) => {
  const { 
    code, 
    discountType, 
    discountValue, 
    maxDiscount,
    minOrderValue,
    expiryDate, 
    usageLimit, 
    description 
  } = couponData;

  const existingCoupon = await Coupon.findOne({ where: { code } });
  if (existingCoupon) {
    throw new AppError('Coupon code already exists', 'COUPON_EXISTS', 400);
  }

  if (!['percentage', 'fixed'].includes(discountType)) {
    throw new AppError('Invalid discount type. Must be percentage or fixed', 'INVALID_DISCOUNT_TYPE', 400);
  }

  const coupon = await Coupon.create({
    code,
    discount_type: discountType,
    value: discountValue,
    max_discount: maxDiscount || null,
    min_order_value: minOrderValue || null,
    expiry_date: expiryDate,
    usage_limit: usageLimit || null
  });

  // Note: description is accepted but not stored in database
  // as the coupons table doesn't have a description column

  return {
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discount_type,
      discountValue: parseFloat(coupon.value),
      maxDiscount: coupon.max_discount ? parseFloat(coupon.max_discount) : null,
      minOrderValue: coupon.min_order_value ? parseFloat(coupon.min_order_value) : null,
      expiryDate: coupon.expiry_date,
      usageLimit: coupon.usage_limit,
      createdAt: coupon.created_at
    }
  };
};

const updateCoupon = async (couponId, couponData) => {
  const coupon = await Coupon.findByPk(couponId);
  if (!coupon) {
    throw new AppError('Coupon not found', 'COUPON_NOT_FOUND', 404);
  }

  const { code, discountType, discountValue, expiryDate, usageLimit } = couponData;

  const updateData = {};
  if (code) updateData.code = code;
  if (discountType) updateData.discount_type = discountType;
  if (discountValue) updateData.value = discountValue;
  if (expiryDate) updateData.expiry_date = expiryDate;
  if (usageLimit !== undefined) updateData.usage_limit = usageLimit;

  await coupon.update(updateData);

  return {
    coupon: {
      id: coupon.id,
      code: coupon.code
    }
  };
};

const toggleCouponVisibility = async (couponId, isVisible) => {
  const coupon = await Coupon.findByPk(couponId);
  if (!coupon) {
    throw new AppError('Coupon not found', 'COUPON_NOT_FOUND', 404);
  }

  return { message: 'Coupon visibility updated' };
};

const deleteCoupon = async (couponId) => {
  const coupon = await Coupon.findByPk(couponId);
  if (!coupon) {
    throw new AppError('Coupon not found', 'COUPON_NOT_FOUND', 404);
  }

  await coupon.destroy();

  return { message: 'Coupon deleted successfully' };
};

const exportCoupons = async (format) => {
  return { message: `Export in ${format} format not yet implemented` };
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
