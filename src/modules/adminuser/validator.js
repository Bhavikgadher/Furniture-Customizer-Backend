// src/modules/adminuser/validator.js
const Joi = require('joi');

const listUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().optional(),
  role: Joi.string().optional(),
  status: Joi.string().optional()
});

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().required(),
  password: Joi.string().min(6).optional()
});

const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive').optional()
});

const toggleStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive').required()
});

module.exports = {
  listUsersSchema,
  createUserSchema,
  updateUserSchema,
  toggleStatusSchema
};
