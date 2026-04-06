// src/modules/vendor/controller.js
const vendorService = require('./service');

const getStats = async (req, res, next) => {
  try {
    const result = await vendorService.getStats();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const listVendors = async (req, res, next) => {
  try {
    const result = await vendorService.listVendors(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getVendorById = async (req, res, next) => {
  try {
    const result = await vendorService.getVendorById(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getApplications = async (req, res, next) => {
  try {
    const result = await vendorService.getApplications(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const createVendor = async (req, res, next) => {
  try {
    const result = await vendorService.createVendor(req.body);
    res.status(201).json({ success: true, data: result, message: 'Vendor created successfully' });
  } catch (error) {
    next(error);
  }
};

const inviteVendor = async (req, res, next) => {
  try {
    const result = await vendorService.inviteVendor(req.body);
    res.json({ success: true, data: result, message: 'Vendor invited successfully' });
  } catch (error) {
    next(error);
  }
};

const approveApplication = async (req, res, next) => {
  try {
    const result = await vendorService.approveApplication(req.params.id, req.body.note);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const rejectApplication = async (req, res, next) => {
  try {
    const result = await vendorService.rejectApplication(req.params.id, req.body.reason);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const updateVendor = async (req, res, next) => {
  try {
    const result = await vendorService.updateVendor(req.params.id, req.body);
    res.json({ success: true, data: result, message: 'Vendor updated successfully' });
  } catch (error) {
    next(error);
  }
};

const toggleVendorStatus = async (req, res, next) => {
  try {
    const result = await vendorService.toggleVendorStatus(req.params.id, req.body.status);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

const exportVendors = async (req, res, next) => {
  try {
    const result = await vendorService.exportVendors(req.query.format);
    res.json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  listVendors,
  getVendorById,
  getApplications,
  createVendor,
  inviteVendor,
  approveApplication,
  rejectApplication,
  updateVendor,
  toggleVendorStatus,
  exportVendors
};
