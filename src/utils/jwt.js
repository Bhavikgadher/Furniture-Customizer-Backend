// src/utils/jwt.js
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateToken = (payload) => {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, env.jwt.secret);
};

const getTokenExpiresIn = () => {
  const expiresIn = env.jwt.expiresIn;
  if (expiresIn.endsWith('h')) {
    return parseInt(expiresIn) * 3600;
  }
  if (expiresIn.endsWith('d')) {
    return parseInt(expiresIn) * 86400;
  }
  return 3600;
};

module.exports = {
  generateToken,
  verifyToken,
  getTokenExpiresIn
};
