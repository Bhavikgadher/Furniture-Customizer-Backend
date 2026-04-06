// src/modules/order/validator.js
const Joi = require('joi');

const listOrdersSchema = Joi.object({
  status: Joi.string().optional(),
  payment: Joi.string().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional()
});

const createOrderSchema = Joi.object({
  userId: Joi.string().uuid().optional(),
  customerId: Joi.string().uuid().optional(),
  customerName: Joi.string().optional(),
  total: Joi.number().positive().required(),
  paymentStatus: Joi.string().valid('pending', 'paid', 'failed', 'refunded').optional(),
  orderStatus: Joi.string().valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled').optional()
}).or('userId', 'customerId');

const updateOrderSchema = Joi.object({
  customerName: Joi.string().optional(),
  total: Joi.number().positive().optional(),
  paymentStatus: Joi.string().valid('pending', 'paid', 'failed', 'refunded').optional(),
  orderStatus: Joi.string().valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled').optional()
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled').required(),
  reason: Joi.string().optional()
});

module.exports = {
  listOrdersSchema,
  createOrderSchema,
  updateOrderSchema,
  updateOrderStatusSchema
};
