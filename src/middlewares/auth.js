// src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { AppError } = require('./errorHandler');

const authenticate = (req, res, next) => {
  try {
    let token = req.cookies.token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      throw new AppError('No token provided', 'UNAUTHORIZED', 401);
    }
    
    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 'INVALID_TOKEN', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 'TOKEN_EXPIRED', 401));
    }
    next(error);
  }
};

module.exports = { authenticate };
