// src/modules/product/service.js
const { FurnitureModel, Category, Vendor } = require('../../database/models');
const { Op } = require('sequelize');
const { AppError } = require('../../middlewares/errorHandler');

const getStats = async () => {
  const total = await FurnitureModel.count();
  const active = await FurnitureModel.count({ where: { is_active: true } });
  const pending = await FurnitureModel.count({ where: { is_active: false } });

  return {
    stats: {
      total,
      active,
      pending
    }
  };
};

const listProducts = async (filters) => {
  const { category, status, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  const where = {};
  
  // Handle category filter - can be either UUID or category name
  if (category) {
    // Check if it's a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(category)) {
      where.category_id = category;
    } else {
      // If not UUID, find category by name first
      const categoryRecord = await Category.findOne({ where: { name: category } });
      if (categoryRecord) {
        where.category_id = categoryRecord.id;
      } else {
        // Return empty result if category not found
        return {
          products: [],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            totalPages: 0
          }
        };
      }
    }
  }
  
  if (status === 'active') where.is_active = true;
  if (status === 'inactive') where.is_active = false;

  const { count, rows } = await FurnitureModel.findAndCountAll({
    where,
    include: [
      { model: Category, as: 'category', attributes: ['name'] },
      { model: Vendor, as: 'vendor', attributes: ['company_name'] }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']]
  });

  return {
    products: rows.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category?.name,
      vendor: p.vendor?.company_name,
      price: parseFloat(p.base_price),
      status: p.is_active ? 'active' : 'inactive',
      image: p.base_image,
      createdAt: p.created_at
    })),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
};

const getProductById = async (productId) => {
  const product = await FurnitureModel.findByPk(productId, {
    include: [
      { model: Category, as: 'category' },
      { model: Vendor, as: 'vendor' }
    ]
  });

  if (!product) {
    throw new AppError('Product not found', 'PRODUCT_NOT_FOUND', 404);
  }

  return {
    product: {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category?.name,
      categoryId: product.category_id,
      vendor: product.vendor?.company_name,
      vendorId: product.vendor_id,
      price: parseFloat(product.base_price),
      status: product.is_active ? 'active' : 'inactive',
      image: product.base_image,
      createdAt: product.created_at
    }
  };
};

const getPendingProducts = async (filters) => {
  const { page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  const { count, rows } = await FurnitureModel.findAndCountAll({
    where: { is_active: false },
    include: [
      { model: Category, as: 'category', attributes: ['name'] },
      { model: Vendor, as: 'vendor', attributes: ['company_name'] }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']]
  });

  return {
    pendingProducts: rows.map(p => ({
      id: p.id,
      name: p.name,
      vendor: p.vendor?.company_name,
      category: p.category?.name,
      price: parseFloat(p.base_price),
      submittedAt: p.created_at
    })),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
};

const createProduct = async (productData) => {
  const { 
    name, 
    vendor, 
    vendorId, 
    category, 
    categoryId, 
    status, 
    price, 
    basePrice, 
    sku, 
    description, 
    images 
  } = productData;

  // Support both field names
  const finalCategoryId = category || categoryId;
  const finalVendorId = vendor || vendorId;
  const finalPrice = price || basePrice;

  const categoryRecord = await Category.findByPk(finalCategoryId);
  if (!categoryRecord) {
    throw new AppError('Category not found', 'CATEGORY_NOT_FOUND', 404);
  }

  const vendorRecord = await Vendor.findByPk(finalVendorId);
  if (!vendorRecord) {
    throw new AppError('Vendor not found', 'VENDOR_NOT_FOUND', 404);
  }

  // Map status values
  let isActive = true;
  if (status === 'inactive' || status === 'draft') {
    isActive = false;
  } else if (status === 'active' || status === 'featured') {
    isActive = true;
  }

  const product = await FurnitureModel.create({
    name,
    category_id: finalCategoryId,
    vendor_id: finalVendorId,
    base_price: finalPrice,
    description: description || null,
    base_image: images?.[0] || null,
    is_active: isActive
  });

  return {
    product: {
      id: product.id,
      name: product.name,
      createdAt: product.created_at
    }
  };
};

const updateProduct = async (productId, productData) => {
  const product = await FurnitureModel.findByPk(productId);
  if (!product) {
    throw new AppError('Product not found', 'PRODUCT_NOT_FOUND', 404);
  }

  const { name, vendor, category, status, price, description, images } = productData;

  const updateData = {};
  if (name) updateData.name = name;
  if (description) updateData.description = description;
  if (price) updateData.base_price = price;
  if (status) updateData.is_active = status === 'active';
  if (category) updateData.category_id = category;
  if (vendor) updateData.vendor_id = vendor;
  if (images && images[0]) updateData.base_image = images[0];

  await product.update(updateData);

  return {
    product: {
      id: product.id,
      name: product.name,
      updatedAt: product.updated_at
    }
  };
};

const deleteProduct = async (productId) => {
  const product = await FurnitureModel.findByPk(productId);
  if (!product) {
    throw new AppError('Product not found', 'PRODUCT_NOT_FOUND', 404);
  }

  await product.update({ deleted_at: new Date() });

  return { message: 'Product deleted successfully' };
};

const approveProduct = async (productId) => {
  const product = await FurnitureModel.findByPk(productId);
  if (!product) {
    throw new AppError('Product not found', 'PRODUCT_NOT_FOUND', 404);
  }

  await product.update({ is_active: true });

  return { message: 'Product approved successfully' };
};

const rejectProduct = async (productId, reason) => {
  const product = await FurnitureModel.findByPk(productId);
  if (!product) {
    throw new AppError('Product not found', 'PRODUCT_NOT_FOUND', 404);
  }

  await product.destroy();

  return { message: 'Product rejected' };
};

const exportProducts = async (format) => {
  return { message: `Export in ${format} format not yet implemented` };
};

module.exports = {
  getStats,
  listProducts,
  getProductById,
  getPendingProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  approveProduct,
  rejectProduct,
  exportProducts
};
