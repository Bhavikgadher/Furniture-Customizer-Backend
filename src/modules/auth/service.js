// src/modules/auth/service.js
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User, Role, PasswordReset } = require('../../database/models');
const { generateToken, getTokenExpiresIn } = require('../../utils/jwt');
const { AppError } = require('../../middlewares/errorHandler');

const login = async (email, password) => {
  const user = await User.findOne({
    where: { email },
    include: [{ model: Role, as: 'role' }]
  });

  if (!user) {
    throw new AppError('Invalid credentials', 'INVALID_CREDENTIALS', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 'INVALID_CREDENTIALS', 401);
  }

  if (!user.is_active) {
    throw new AppError('Account is inactive', 'ACCOUNT_INACTIVE', 403);
  }

  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role.name
  };

  const token = generateToken(tokenPayload);
  const refreshToken = crypto.randomBytes(32).toString('hex');

  return {
    token,
    refreshToken,
    expiresIn: getTokenExpiresIn(),
    user: {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: user.role.name,
      avatar: null
    }
  };
};

const register = async (userData) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('Email already exists', 'EMAIL_EXISTS', 400);
  }

  const adminRole = await Role.findOne({ where: { name: 'admin' } });
  if (!adminRole) {
    throw new AppError('Admin role not found', 'ROLE_NOT_FOUND', 500);
  }

  const password_hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    full_name: name,
    email,
    password_hash,
    role_id: adminRole.id,
    is_active: true
  });

  return {
    user: {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: 'admin'
    }
  };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  
  if (!user) {
    return { message: 'If the email exists, a reset link has been sent' };
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  await PasswordReset.create({
    user_id: user.id,
    token,
    expires_at: expiresAt
  });

  return { message: 'If the email exists, a reset link has been sent' };
};

const resetPassword = async ({ token, newPassword }) => {
  const resetRecord = await PasswordReset.findOne({
    where: { token },
    include: [{ model: User, foreignKey: 'user_id' }]
  });

  if (!resetRecord || new Date() > resetRecord.expires_at) {
    throw new AppError('Invalid or expired reset token', 'INVALID_TOKEN', 400);
  }

  const password_hash = await bcrypt.hash(newPassword, 10);
  
  await User.update(
    { password_hash },
    { where: { id: resetRecord.user_id } }
  );

  await PasswordReset.destroy({ where: { token } });

  return { message: 'Password reset successful' };
};

const refreshToken = async (refreshToken) => {
  const token = generateToken({ refreshToken });
  
  return {
    token
  };
};

const logout = async () => {
  return { message: 'Logged out successfully' };
};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout
};
