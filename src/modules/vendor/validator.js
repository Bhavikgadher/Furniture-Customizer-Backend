// src/modules/vendor/validator.js
const Joi = require('joi');

const listVendorsSchema = Joi.object({
  status: Joi.string().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional()
});

const createVendorSchema = Joi.object({
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional(),
  company_name: Joi.string().required(),
  gst_number: Joi.string().optional()
});

module.exports = {
  listVendorsSchema,
  createVendorSchema
};
