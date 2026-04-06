// src/modules/customer/wishlist/service.js
const { Wishlist, WishlistItem, FurnitureModel, Category } = require('../../../database/models');
const { AppError } = require('../../../middlewares/errorHandler');

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ where: { user_id: userId } });
  if (!wishlist) wishlist = await Wishlist.create({ user_id: userId });
  return wishlist;
};

const getWishlist = async (userId) => {
  const wishlist = await getOrCreateWishlist(userId);
  const items = await WishlistItem.findAll({
    where: { wishlist_id: wishlist.id },
    include: [{ model: FurnitureModel, as: 'product', attributes: ['id', 'name', 'base_price', 'base_image'], include: [{ model: Category, as: 'category', attributes: ['name'] }] }],
    order: [['added_at', 'DESC']]
  });
  return { wishlist: { id: wishlist.id, items } };
};

const addItem = async (userId, { model_id }) => {
  const product = await FurnitureModel.findOne({ where: { id: model_id, is_active: true } });
  if (!product) throw new AppError('Product not found', 'PRODUCT_NOT_FOUND', 404);

  const wishlist = await getOrCreateWishlist(userId);
  const existing = await WishlistItem.findOne({ where: { wishlist_id: wishlist.id, model_id } });
  if (existing) throw new AppError('Product already in wishlist', 'ALREADY_IN_WISHLIST', 400);

  const item = await WishlistItem.create({ wishlist_id: wishlist.id, model_id });
  return { item };
};

const removeItem = async (userId, itemId) => {
  const wishlist = await getOrCreateWishlist(userId);
  const item = await WishlistItem.findOne({ where: { id: itemId, wishlist_id: wishlist.id } });
  if (!item) throw new AppError('Item not found in wishlist', 'ITEM_NOT_FOUND', 404);
  await item.destroy();
  return { message: 'Removed from wishlist' };
};

const checkItem = async (userId, modelId) => {
  const wishlist = await getOrCreateWishlist(userId);
  const item = await WishlistItem.findOne({ where: { wishlist_id: wishlist.id, model_id: modelId } });
  return { inWishlist: !!item };
};

module.exports = { getWishlist, addItem, removeItem, checkItem };
