// src/modules/customer/auth/controller.js
const service = require('./service');

const register = async (req, res, next) => {
  try {
    const result = await service.register(req.body);
    res.status(201).json({ success: true, data: result, message: 'Registration successful' });
  } catch (e) { next(e); }
};

const login = async (req, res, next) => {
  try {
    const result = await service.login(req.body);
    res.json({ success: true, data: result });
  } catch (e) { next(e); }
};

const forgotPassword = async (req, res, next) => {
  try {
    const result = await service.forgotPassword(req.body.email);
    res.json({ success: true, message: result.message });
  } catch (e) { next(e); }
};

const resetPassword = async (req, res, next) => {
  try {
    const result = await service.resetPassword(req.body);
    res.json({ success: true, message: result.message });
  } catch (e) { next(e); }
};

const logout = (req, res) => res.json({ success: true, message: 'Logged out successfully' });

module.exports = { register, login, forgotPassword, resetPassword, logout };
