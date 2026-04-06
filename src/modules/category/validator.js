// src/modules/category/validator.js
const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  parentId: Joi.string().uuid().optional().allow(null)
});

const updateCategorySchema = Joi.object({
  name: Joi.string().optional(),
  parentId: Joi.string().uuid().optional().allow(null)
});

module.exports = {
  createCategorySchema,
  updateCategorySchema
};
