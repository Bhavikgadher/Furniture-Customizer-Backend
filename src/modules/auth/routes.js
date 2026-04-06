// src/modules/auth/routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { validate } = require('../../middlewares/validate');
const { 
  loginSchema, 
  registerSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema,
  refreshTokenSchema 
} = require('./validator');

router.post('/login', validate(loginSchema), controller.login);
router.post('/register', validate(registerSchema), controller.register);
router.post('/forgot-password', validate(forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), controller.resetPassword);
router.post('/refresh-token', validate(refreshTokenSchema), controller.refreshToken);
router.post('/logout', controller.logout);

module.exports = router;
