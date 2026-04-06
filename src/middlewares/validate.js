// src/middlewares/validate.js
const { AppError } = require('./errorHandler');

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(message, 'VALIDATION_ERROR', 400));
    }
    
    next();
  };
};

module.exports = { validate };
