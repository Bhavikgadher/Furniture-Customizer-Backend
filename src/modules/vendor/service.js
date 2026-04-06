// src/modules/vendor/service.js
const bcrypt = require('bcryptjs');
const { Vendor, User, FurnitureModel, Role } = require('../../database/models');
const { Op } = require('sequelize');
const { AppError } = require('../../middlewares/errorHandler');

const getStats = async () => {
  const total = await Vendor.count();
  const approved = await Vendor.count({ where: { is_approved: true } });
  const pending = await Vendor.count({ where: { is_approved: false } });

  return {
    stats: {
      total,
      approved,
      pending
    }
  };
};

const listVendors = async (filters) => {
  const { status, search, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  const where = {};
  if (status === 'approved') {
    where.is_approved = true;
  } else if (status === 'pending') {
    where.is_approved = false;
  }

  if (search) {
    where.company_name = { [Op.iLike]: `%${search}%` };
  }

  const { count, rows } = await Vendor.findAndCountAll({
    where,
    include: [{ model: User, as: 'user', attributes: ['full_name', 'email'] }],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']]
  });

  return {
    vendors: rows.map(vendor => ({
      id: vendor.id,
      companyName: vendor.company_name,
      gstNumber: vendor.gst_number,
      status: vendor.is_approved ? 'approved' : 'pending',
      contactPerson: vendor.user?.full_name,
      email: vendor.user?.email,
      createdAt: vendor.created_at
    })),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
};

const getVendorById = async (vendorId) => {
  const vendor = await Vendor.findByPk(vendorId, {
    include: [{ model: User, as: 'user' }]
  });

  if (!vendor) {
    throw new AppError('Vendor not found', 'VENDOR_NOT_FOUND', 404);
  }

  const productCount = await FurnitureModel.count({ where: { vendor_id: vendorId } });

  return {
    vendor: {
      id: vendor.id,
      companyName: vendor.company_name,
      gstNumber: vendor.gst_number,
      status: vendor.is_approved ? 'approved' : 'pending',
      contactPerson: vendor.user?.full_name,
      email: vendor.user?.email,
      phone: vendor.user?.phone,
      productCount,
      createdAt: vendor.created_at
    }
  };
};

const getApplications = async (filters) => {
  const { status = 'pending', page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  const where = { is_approved: status === 'approved' };

  const { count, rows } = await Vendor.findAndCountAll({
    where,
    include: [{ model: User, as: 'user' }],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']]
  });

  return {
    applications: rows.map(v => ({
      id: v.id,
      companyName: v.company_name,
      contactPerson: v.user?.full_name,
      email: v.user?.email,
      status: v.is_approved ? 'approved' : 'pending',
      appliedAt: v.created_at
    })),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
};

const createVendor = async (vendorData) => {
  const { full_name, email, password, phone, company_name, gst_number } = vendorData;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new AppError('Email already exists', 'EMAIL_EXISTS', 400);
  }

  const vendorRole = await Role.findOne({ where: { name: 'vendor' } });
  if (!vendorRole) {
    throw new AppError('Vendor role not found', 'ROLE_NOT_FOUND', 500);
  }

  const password_hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    full_name,
    email,
    password_hash,
    phone: phone || null,
    role_id: vendorRole.id,
    is_active: true,
    is_verified: true
  });

  const vendor = await Vendor.create({
    user_id: user.id,
    company_name,
    gst_number: gst_number || null,
    is_approved: true
  });

  return {
    vendor: {
      id: vendor.id,
      companyName: vendor.company_name,
      gstNumber: vendor.gst_number,
      contactPerson: user.full_name,
      email: user.email,
      phone: user.phone,
      status: 'approved',
      createdAt: vendor.created_at
    }
  };
};

const inviteVendor = async (inviteData) => {
  const { name, email, phone } = inviteData;

  return {
    invitation: {
      name,
      email,
      phone,
      invitedAt: new Date()
    }
  };
};

const approveApplication = async (applicationId, note) => {
  const vendor = await Vendor.findByPk(applicationId);
  if (!vendor) {
    throw new AppError('Application not found', 'APPLICATION_NOT_FOUND', 404);
  }

  await vendor.update({ is_approved: true });

  return { message: 'Vendor application approved successfully' };
};

const rejectApplication = async (applicationId, reason) => {
  const vendor = await Vendor.findByPk(applicationId);
  if (!vendor) {
    throw new AppError('Application not found', 'APPLICATION_NOT_FOUND', 404);
  }

  await vendor.destroy();

  return { message: 'Vendor application rejected' };
};

const updateVendor = async (vendorId, vendorData) => {
  const vendor = await Vendor.findByPk(vendorId);
  if (!vendor) {
    throw new AppError('Vendor not found', 'VENDOR_NOT_FOUND', 404);
  }

  await vendor.update(vendorData);

  return {
    vendor: {
      id: vendor.id,
      companyName: vendor.company_name,
      gstNumber: vendor.gst_number
    }
  };
};

const toggleVendorStatus = async (vendorId, status) => {
  const vendor = await Vendor.findByPk(vendorId);
  if (!vendor) {
    throw new AppError('Vendor not found', 'VENDOR_NOT_FOUND', 404);
  }

  await vendor.update({ is_approved: status === 'active' });

  return { message: 'Vendor status updated successfully' };
};

const exportVendors = async (format) => {
  return { message: `Export in ${format} format not yet implemented` };
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
