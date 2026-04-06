// src/modules/adminuser/controller.js
const adminUserService = require('./service');

const getStats = async (req, res, next) => {
  try {
    const result = await adminUserService.getStats();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const result = await adminUserService.listUsers(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const result = await adminUserService.getUserById(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const result = await adminUserService.createUser(req.body);
    res.json({ success: true, data: result, message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const result = await adminUserService.updateUser(req.params.id, req.body);
    res.json({ success: true, data: result, message: 'User updated successfully' });
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const result = await adminUserService.toggleUserStatus(req.params.id, req.body.status);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const result = await adminUserService.deleteUser(req.params.id);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const exportUsers = async (req, res, next) => {
  try {
    const result = await adminUserService.exportUsers(req.query.format);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
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
