// src/modules/adminuser/service.js
const bcrypt = require('bcryptjs');
const { User, Role, sequelize } = require('../../database/models');
const { Op } = require('sequelize');
const { AppError } = require('../../middlewares/errorHandler');

const getStats = async () => {
  const totalUsers = await User.count();
  const activeUsers = await User.count({ where: { is_active: true } });
  const inactiveUsers = await User.count({ where: { is_active: false } });
  
  const roleStats = await User.findAll({
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('User.id')), 'count']
    ],
    include: [{
      model: Role,
      as: 'role',
      attributes: ['name']
    }],
    group: ['role.id', 'role.name'],
    raw: true
  });

  return {
    stats: {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      byRole: roleStats
    }
  };
};

const listUsers = async (filters) => {
  const { page = 1, limit = 10, search, role, status } = filters;
  const offset = (page - 1) * limit;

  const where = {};
  
  if (search) {
    where[Op.or] = [
      { full_name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } }
    ];
  }

  if (status) {
    where.is_active = status === 'active';
  }

  const include = [{
    model: Role,
    as: 'role',
    attributes: ['name']
  }];

  if (role) {
    include[0].where = { name: role };
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    include,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']]
  });

  const users = rows.map(user => ({
    id: user.id,
    name: user.full_name,
    email: user.email,
    role: user.role.name,
    status: user.is_active ? 'active' : 'inactive',
    joinDate: user.created_at,
    avatarUrl: null
  }));

  return {
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
};

const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [{ model: Role, as: 'role' }]
  });

  if (!user) {
    throw new AppError('User not found', 'USER_NOT_FOUND', 404);
  }

  return {
    user: {
      id: user.id,
      name: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role.name,
      status: user.is_active ? 'active' : 'inactive',
      isVerified: user.is_verified,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }
  };
};

const createUser = async (userData) => {
  const { name, email, role, password } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('Email already exists', 'EMAIL_EXISTS', 400);
  }

  const roleRecord = await Role.findOne({ where: { name: role } });
  if (!roleRecord) {
    throw new AppError('Invalid role', 'INVALID_ROLE', 400);
  }

  const password_hash = await bcrypt.hash(password || 'Password123!', 10);

  const user = await User.create({
    full_name: name,
    email,
    password_hash,
    role_id: roleRecord.id,
    is_active: true
  });

  return {
    user: {
      id: user.id,
      name: user.full_name,
      email: user.email,
      role: role,
      createdAt: user.created_at
    }
  };
};

const updateUser = async (userId, userData) => {
  const { name, email, role, status } = userData;

  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 'USER_NOT_FOUND', 404);
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('Email already exists', 'EMAIL_EXISTS', 400);
    }
  }

  const updateData = {};
  if (name) updateData.full_name = name;
  if (email) updateData.email = email;
  if (status) updateData.is_active = status === 'active';

  if (role) {
    const roleRecord = await Role.findOne({ where: { name: role } });
    if (!roleRecord) {
      throw new AppError('Invalid role', 'INVALID_ROLE', 400);
    }
    updateData.role_id = roleRecord.id;
  }

  await user.update(updateData);

  return {
    user: {
      id: user.id,
      name: user.full_name,
      email: user.email,
      status: user.is_active ? 'active' : 'inactive'
    }
  };
};

const toggleUserStatus = async (userId, status) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 'USER_NOT_FOUND', 404);
  }

  await user.update({ is_active: status === 'active' });

  return { message: 'User status updated successfully' };
};

const deleteUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('User not found', 'USER_NOT_FOUND', 404);
  }

  await user.destroy();

  return { message: 'User deleted successfully' };
};

const exportUsers = async (format) => {
  return { message: `Export in ${format} format not yet implemented` };
};

module.exports = {
  getStats,
  listUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
  exportUsers
};
