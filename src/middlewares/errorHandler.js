// src/middlewares/errorHandler.js
class AppError extends Error {
  constructor(message, errorCode, statusCode = 400) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      data: null,
      message: err.message,
      errors: [{ field: err.errorCode, message: err.message }]
    });
  }

  console.error('Unhandled error:', err);
  
  return res.status(500).json({
    success: false,
    data: null,
    message: 'An unexpected error occurred',
    errors: null
  });
};

module.exports = { errorHandler, AppError };
