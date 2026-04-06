// src/modules/customer/catalog/service.js
const { FurnitureModel, Category, Vendor, User, Review, Material, Color, Fabric, Size, AddOn } = require('../../../database/models');
const { Op } = require('sequelize');
const { AppError } = require('../../../middlewares/errorHandler');

const listProducts = async ({ page = 1, limit = 12, category, search, sort = 'newest' }) => {
  const offset = (page - 1) * limit;
  const where = { is_active: true, deleted_at: null };

  if (category) {
    const cat = await Category.findOne({ where: { name: category } });
    if (cat) where.category_id = cat.id;
  }
  if (search) where.name = { [Op.iLike]: `%${search}%` };

  const order = sort === 'price_asc' ? [['base_price', 'ASC']]
    : sort === 'price_desc' ? [['base_price', 'DESC']]
    : [['created_at', 'DESC']];

  const { count, rows } = await FurnitureModel.findAndCountAll({
    where,
    include: [
      { model: Category, as: 'category', attributes: ['id', 'name'] },
      { model: Vendor, as: 'vendor', attributes: ['id', 'company_name'] }
    ],
    limit: parseInt(limit),
    offset,
    order
  });

  return {
    products: rows.map(p => ({
      id: p.id, name: p.name, price: parseFloat(p.base_price),
      image: p.base_image, category: p.category?.name, vendor: p.vendor?.company_name
    })),
    pagination: { page: parseInt(page), limit: parseInt(limit), total: count, totalPages: Math.ceil(count / limit) }
  };
};

const getProductById = async (productId) => {
  const product = await FurnitureModel.findOne({
    where: { id: productId, is_active: true, deleted_at: null },
    include: [
      { model: Category, as: 'category' },
      { model: Vendor, as: 'vendor', include: [{ model: User, as: 'user', attributes: ['full_name'] }] }
    ]
  });
  if (!product) throw new AppError('Product not found', 'PRODUCT_NOT_FOUND', 404);

  return {
    product: {
      id: product.id, name: product.name, description: product.description,
      price: parseFloat(product.base_price), image: product.base_image,
      category: { id: product.category?.id, name: product.category?.name },
      vendor: { id: product.vendor?.id, name: product.vendor?.company_name }
    }
  };
};

const getProductReviews = async (productId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await Review.findAndCountAll({
    where: { model_id: productId },
    include: [{ model: User, foreignKey: 'user_id', attributes: ['full_name'] }],
    limit: parseInt(limit), offset, order: [['created_at', 'DESC']]
  });
  return {
    reviews: rows.map(r => ({ id: r.id, rating: r.rating, comment: r.comment, user: r.User?.full_name, createdAt: r.created_at })),
    pagination: { page: parseInt(page), limit: parseInt(limit), total: count, totalPages: Math.ceil(count / limit) }
  };
};

const listCategories = async () => {
  const categories = await Category.findAll({ where: { parent_id: null }, include: [{ model: Category, as: 'children' }], order: [['name', 'ASC']] });
  return { categories };
};

const getProductsByCategory = async (categoryId, { page = 1, limit = 12 }) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await FurnitureModel.findAndCountAll({
    where: { category_id: categoryId, is_active: true, deleted_at: null },
    include: [{ model: Vendor, as: 'vendor', attributes: ['company_name'] }],
    limit: parseInt(limit), offset, order: [['created_at', 'DESC']]
  });
  return {
    products: rows.map(p => ({ id: p.id, name: p.name, price: parseFloat(p.base_price), image: p.base_image, vendor: p.vendor?.company_name })),
    pagination: { page: parseInt(page), limit: parseInt(limit), total: count, totalPages: Math.ceil(count / limit) }
  };
};

const searchProducts = async ({ q, page = 1, limit = 12 }) => {
  if (!q) return { products: [], pagination: { page: 1, limit: parseInt(limit), total: 0, totalPages: 0 } };
  const offset = (page - 1) * limit;
  const { count, rows } = await FurnitureModel.findAndCountAll({
    where: { is_active: true, deleted_at: null, [Op.or]: [{ name: { [Op.iLike]: `%${q}%` } }, { description: { [Op.iLike]: `%${q}%` } }] },
    include: [{ model: Category, as: 'category', attributes: ['name'] }],
    limit: parseInt(limit), offset
  });
  return {
    products: rows.map(p => ({ id: p.id, name: p.name, price: parseFloat(p.base_price), image: p.base_image, category: p.category?.name })),
    pagination: { page: parseInt(page), limit: parseInt(limit), total: count, totalPages: Math.ceil(count / limit) }
  };
};

const getFeaturedProducts = async () => {
  const rows = await FurnitureModel.findAll({
    where: { is_active: true, deleted_at: null },
    include: [{ model: Category, as: 'category', attributes: ['name'] }],
    limit: 8, order: [['created_at', 'DESC']]
  });
  return { products: rows.map(p => ({ id: p.id, name: p.name, price: parseFloat(p.base_price), image: p.base_image, category: p.category?.name })) };
};

const getVendorStore = async (vendorId, { page = 1, limit = 12 }) => {
  const vendor = await Vendor.findByPk(vendorId, { include: [{ model: User, as: 'user', attributes: ['full_name'] }] });
  if (!vendor) throw new AppError('Vendor not found', 'VENDOR_NOT_FOUND', 404);
  const offset = (page - 1) * limit;
  const { count, rows } = await FurnitureModel.findAndCountAll({
    where: { vendor_id: vendorId, is_active: true, deleted_at: null },
    limit: parseInt(limit), offset, order: [['created_at', 'DESC']]
  });
  return {
    vendor: { id: vendor.id, name: vendor.company_name, contact: vendor.user?.full_name },
    products: rows.map(p => ({ id: p.id, name: p.name, price: parseFloat(p.base_price), image: p.base_image })),
    pagination: { page: parseInt(page), limit: parseInt(limit), total: count, totalPages: Math.ceil(count / limit) }
  };
};

module.exports = { listProducts, getProductById, getProductReviews, listCategories, getProductsByCategory, searchProducts, getFeaturedProducts, getVendorStore };
