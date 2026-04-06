// src/modules/security/controller.js
const securityService = require('./service');

const getStats = async (req, res, next) => {
  try {
    const result = await securityService.getStats();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const listRoles = async (req, res, next) => {
  try {
    const result = await securityService.listRoles();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const createRole = async (req, res, next) => {
  try {
    const result = await securityService.createRole(req.body);
    res.json({ success: true, data: result, message: 'Role created successfully' });
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const result = await securityService.updateRole(req.params.id, req.body);
    res.json({ success: true, data: result, message: 'Role updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const result = await securityService.deleteRole(req.params.id);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const getAuditLogs = async (req, res, next) => {
  try {
    const result = await securityService.getAuditLogs(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const exportAuditLogs = async (req, res, next) => {
  try {
    const result = await securityService.exportAuditLogs(req.query.format);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const getUserAssignments = async (req, res, next) => {
  try {
    const result = await securityService.getUserAssignments(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
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
