// src/modules/coupon/validator.js
const Joi = require('joi');

const createCouponSchema = Joi.object({
  code: Joi.string().required(),
  discountType: Joi.string().valid('percentage', 'fixed').required(),
  discountValue: Joi.number().positive().required(),
  maxDiscount: Joi.number().positive().optional(),
  minOrderValue: Joi.number().positive().optional(),
  expiryDate: Joi.date().iso().required(),
  usageLimit: Joi.number().integer().positive().optional(),
  description: Joi.string().optional()
});

module.exports = {
  createCouponSchema
};
