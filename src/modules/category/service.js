// src/modules/category/service.js
const { Category, FurnitureModel } = require('../../database/models');
const { AppError } = require('../../middlewares/errorHandler');

const listCategories = async (filters) => {
  const { page, limit, includeChildren = true } = filters;

  let queryOptions = {
    order: [['name', 'ASC']]
  };

  // If pagination is requested
  if (page && limit) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    queryOptions.limit = parseInt(limit);
    queryOptions.offset = offset;
  }

  // Include child categories if requested
  if (includeChildren) {
    queryOptions.include = [{
      model: Category,
      as: 'children',
      attributes: ['id', 'name', 'parent_id']
    }];
  }

  const { count, rows } = await Category.findAndCountAll(queryOptions);

  const categories = await Promise.all(rows.map(async (cat) => {
    const productCount = await FurnitureModel.count({ where: { category_id: cat.id } });
    
    return {
      id: cat.id,
      name: cat.name,
      parentId: cat.parent_id,
      productCount,
      children: cat.children || [],
      createdAt: cat.created_at
    };
  }));

  if (page && limit) {
    return {
      categories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / parseInt(limit))
      }
    };
  }

  return { categories };
};

const getCategoryById = async (categoryId) => {
  const category = await Category.findByPk(categoryId, {
    include: [
      { model: Category, as: 'parent', attributes: ['id', 'name'] },
      { model: Category, as: 'children', attributes: ['id', 'name'] }
    ]
  });

  if (!category) {
    throw new AppError('Category not found', 'CATEGORY_NOT_FOUND', 404);
  }

  const productCount = await FurnitureModel.count({ where: { category_id: categoryId } });

  return {
    category: {
      id: category.id,
      name: category.name,
      parentId: category.parent_id,
      parent: category.parent,
      children: category.children || [],
      productCount,
      createdAt: category.created_at,
      updatedAt: category.updated_at
    }
  };
};

const createCategory = async (categoryData) => {
  const { name, parentId } = categoryData;

  const existingCategory = await Category.findOne({ 
    where: { name, parent_id: parentId || null } 
  });
  
  if (existingCategory) {
    throw new AppError('Category with this name already exists', 'CATEGORY_EXISTS', 400);
  }

  if (parentId) {
    const parentCategory = await Category.findByPk(parentId);
    if (!parentCategory) {
      throw new AppError('Parent category not found', 'PARENT_CATEGORY_NOT_FOUND', 404);
    }
  }

  const category = await Category.create({
    name,
    parent_id: parentId || null
  });

  return {
    category: {
      id: category.id,
      name: category.name,
      parentId: category.parent_id,
      createdAt: category.created_at
    }
  };
};

const updateCategory = async (categoryId, categoryData) => {
  const category = await Category.findByPk(categoryId);
  
  if (!category) {
    throw new AppError('Category not found', 'CATEGORY_NOT_FOUND', 404);
  }

  const { name, parentId } = categoryData;

  // Check if trying to set itself as parent
  if (parentId && parentId === categoryId) {
    throw new AppError('Category cannot be its own parent', 'INVALID_PARENT', 400);
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (parentId !== undefined) {
    if (parentId) {
      const parentCategory = await Category.findByPk(parentId);
      if (!parentCategory) {
        throw new AppError('Parent category not found', 'PARENT_CATEGORY_NOT_FOUND', 404);
      }
    }
    updateData.parent_id = parentId || null;
  }

  await category.update(updateData);

  return {
    category: {
      id: category.id,
      name: category.name,
      parentId: category.parent_id,
      updatedAt: category.updated_at
    }
  };
};

const deleteCategory = async (categoryId) => {
  const category = await Category.findByPk(categoryId);
  
  if (!category) {
    throw new AppError('Category not found', 'CATEGORY_NOT_FOUND', 404);
  }

  // Check if category has products
  const productCount = await FurnitureModel.count({ where: { category_id: categoryId } });
  if (productCount > 0) {
    throw new AppError('Cannot delete category with existing products', 'CATEGORY_HAS_PRODUCTS', 400);
  }

  // Check if category has children
  const childCount = await Category.count({ where: { parent_id: categoryId } });
  if (childCount > 0) {
    throw new AppError('Cannot delete category with subcategories', 'CATEGORY_HAS_CHILDREN', 400);
  }

  await category.destroy();

  return { message: 'Category deleted successfully' };
};

const getCategoryTree = async () => {
  // Get all root categories (no parent)
  const rootCategories = await Category.findAll({
    where: { parent_id: null },
    include: [{
      model: Category,
      as: 'children',
      include: [{
        model: Category,
        as: 'children'
      }]
    }],
    order: [['name', 'ASC']]
  });

  const buildTree = async (categories) => {
    return Promise.all(categories.map(async (cat) => {
      const productCount = await FurnitureModel.count({ where: { category_id: cat.id } });
      
      return {
        id: cat.id,
        name: cat.name,
        productCount,
        children: cat.children ? await buildTree(cat.children) : []
      };
    }));
  };

  const tree = await buildTree(rootCategories);

  return { categories: tree };
};

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree
};
