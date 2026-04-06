// src/modules/customer/auth/service.js
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User, Role, PasswordReset } = require('../../../database/models');
const { generateToken, getTokenExpiresIn } = require('../../../utils/jwt');
const { AppError } = require('../../../middlewares/errorHandler');

const register = async ({ full_name, email, password, phone }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new AppError('Email already exists', 'EMAIL_EXISTS', 400);

  const role = await Role.findOne({ where: { name: 'customer' } });
  if (!role) throw new AppError('Customer role not found', 'ROLE_NOT_FOUND', 500);

  const password_hash = await bcrypt.hash(password, 10);
  const user = await User.create({ full_name, email, password_hash, phone: phone || null, role_id: role.id, is_active: true });

  return { user: { id: user.id, name: user.full_name, email: user.email } };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email }, include: [{ model: Role, as: 'role' }] });
  if (!user) throw new AppError('Invalid credentials', 'INVALID_CREDENTIALS', 401);

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new AppError('Invalid credentials', 'INVALID_CREDENTIALS', 401);

  if (!user.is_active) throw new AppError('Account is inactive', 'ACCOUNT_INACTIVE', 403);

  const token = generateToken({ id: user.id, email: user.email, role: user.role.name });

  return {
    token,
    expiresIn: getTokenExpiresIn(),
    user: { id: user.id, name: user.full_name, email: user.email, role: user.role.name }
  };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return { message: 'If the email exists, a reset link has been sent' };

  const token = crypto.randomBytes(32).toString('hex');
  const expires_at = new Date(Date.now() + 3600000);
  await PasswordReset.create({ user_id: user.id, token, expires_at });

  return { message: 'If the email exists, a reset link has been sent' };
};

const resetPassword = async ({ token, newPassword }) => {
  const record = await PasswordReset.findOne({ where: { token }, include: [{ model: User, foreignKey: 'user_id' }] });
  if (!record || new Date() > record.expires_at) throw new AppError('Invalid or expired token', 'INVALID_TOKEN', 400);

  const password_hash = await bcrypt.hash(newPassword, 10);
  await User.update({ password_hash }, { where: { id: record.user_id } });
  await PasswordReset.destroy({ where: { token } });

  return { message: 'Password reset successful' };
};

module.exports = { register, login, forgotPassword, resetPassword };
