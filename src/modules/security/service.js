// src/modules/security/service.js
const { Role, Permission, RolePermission, User } = require('../../database/models');
const { AppError } = require('../../middlewares/errorHandler');

const getStats = async () => {
  const totalRoles = await Role.count();
  const totalPermissions = await Permission.count();
  const totalUsers = await User.count();

  return {
    stats: {
      totalRoles,
      totalPermissions,
      totalUsers
    }
  };
};

const listRoles = async () => {
  const roles = await Role.findAll({
    include: [{
      model: Permission,
      through: { attributes: [] }
    }],
    order: [['name', 'ASC']]
  });

  return {
    roles: roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissionCount: role.Permissions?.length || 0
    }))
  };
};

const createRole = async (roleData) => {
  const { name, description, accessLevel, permissions } = roleData;

  const existingRole = await Role.findOne({ where: { name } });
  if (existingRole) {
    throw new AppError('Role already exists', 'ROLE_EXISTS', 400);
  }

  const role = await Role.create({
    name,
    description
  });

  if (permissions && permissions.length > 0) {
    const permissionRecords = await Permission.findAll({
      where: { id: permissions }
    });
    await role.setPermissions(permissionRecords);
  }

  return {
    role: {
      id: role.id,
      name: role.name,
      description: role.description
    }
  };
};

const updateRole = async (roleId, roleData) => {
  const role = await Role.findByPk(roleId);
  if (!role) {
    throw new AppError('Role not found', 'ROLE_NOT_FOUND', 404);
  }

  const { name, description, permissions } = roleData;

  const updateData = {};
  if (name) updateData.name = name;
  if (description) updateData.description = description;

  await role.update(updateData);

  if (permissions && permissions.length > 0) {
    const permissionRecords = await Permission.findAll({
      where: { id: permissions }
    });
    await role.setPermissions(permissionRecords);
  }

  return {
    role: {
      id: role.id,
      name: role.name,
      description: role.description
    }
  };
};

const deleteRole = async (roleId) => {
  const role = await Role.findByPk(roleId);
  if (!role) {
    throw new AppError('Role not found', 'ROLE_NOT_FOUND', 404);
  }

  const userCount = await User.count({ where: { role_id: roleId } });
  if (userCount > 0) {
    throw new AppError('Cannot delete role with assigned users', 'ROLE_IN_USE', 400);
  }

  await role.destroy();

  return { message: 'Role deleted successfully' };
};

const getAuditLogs = async (filters) => {
  const { page = 1, limit = 10 } = filters;

  return {
    logs: [],
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: 0,
      totalPages: 0
    }
  };
};

const exportAuditLogs = async (format) => {
  return { message: `Export in ${format} format not yet implemented` };
};

const getUserAssignments = async (filters) => {
  const { page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  const { count, rows } = await User.findAndCountAll({
    include: [{ model: Role, as: 'role', attributes: ['name'] }],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']]
  });

  return {
    assignments: rows.map(user => ({
      userId: user.id,
      userName: user.full_name,
      email: user.email,
      role: user.role?.name
    })),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
};

module.exports = {
  getStats,
  listRoles,
  createRole,
  updateRole,
  deleteRole,
  getAuditLogs,
  exportAuditLogs,
  getUserAssignments
};
