// src/modules/product/validator.js
const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().uuid().optional(),
  categoryId: Joi.string().uuid().optional(),
  vendor: Joi.string().uuid().optional(),
  vendorId: Joi.string().uuid().optional(),
  price: Joi.number().positive().optional(),
  basePrice: Joi.number().positive().optional(),
  sku: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive', 'featured', 'draft').required(),
  description: Joi.string().optional().allow(''),
  images: Joi.array().items(Joi.string()).optional()
}).or('category', 'categoryId')
  .or('vendor', 'vendorId')
  .or('price', 'basePrice');

module.exports = {
  createProductSchema
};
