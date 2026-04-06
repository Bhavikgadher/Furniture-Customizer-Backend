// src/modules/customer/cart/service.js
const { Cart, CartItem, SavedDesign, FurnitureModel, Material, Color, Fabric, Size } = require('../../../database/models');
const { AppError } = require('../../../middlewares/errorHandler');

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ where: { user_id: userId } });
  if (!cart) cart = await Cart.create({ user_id: userId });
  return cart;
};

const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  const items = await CartItem.findAll({
    where: { cart_id: cart.id },
    include: [{
      model: SavedDesign,
      include: [
        { model: FurnitureModel, as: 'model', attributes: ['id', 'name', 'base_image'] },
        { model: Material, as: 'material', attributes: ['id', 'name'] },
        { model: Color, as: 'color', attributes: ['id', 'name', 'hex_code'] },
        { model: Fabric, as: 'fabric', attributes: ['id', 'name'] },
        { model: Size, as: 'size', attributes: ['id', 'name'] }
      ]
    }]
  });

  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.SavedDesign?.calculated_price || 0);
    return sum + price * item.quantity;
  }, 0);

  return { cart: { id: cart.id, items, total: parseFloat(total.toFixed(2)) } };
};

const addItem = async (userId, { saved_design_id, quantity = 1 }) => {
  const cart = await getOrCreateCart(userId);

  const design = await SavedDesign.findOne({ where: { id: saved_design_id, user_id: userId } });
  if (!design) throw new AppError('Design not found', 'DESIGN_NOT_FOUND', 404);

  const existing = await CartItem.findOne({ where: { cart_id: cart.id, saved_design_id } });
  if (existing) {
    await existing.update({ quantity: existing.quantity + quantity });
    return { item: existing };
  }

  const item = await CartItem.create({ cart_id: cart.id, saved_design_id, quantity });
  return { item };
};

const updateItem = async (userId, itemId, { quantity }) => {
  const cart = await getOrCreateCart(userId);
  const item = await CartItem.findOne({ where: { id: itemId, cart_id: cart.id } });
  if (!item) throw new AppError('Cart item not found', 'ITEM_NOT_FOUND', 404);
  if (quantity < 1) throw new AppError('Quantity must be at least 1', 'INVALID_QUANTITY', 400);
  await item.update({ quantity });
  return { item };
};

const removeItem = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId);
  const item = await CartItem.findOne({ where: { id: itemId, cart_id: cart.id } });
  if (!item) throw new AppError('Cart item not found', 'ITEM_NOT_FOUND', 404);
  await item.destroy();
  return { message: 'Item removed from cart' };
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  await CartItem.destroy({ where: { cart_id: cart.id } });
  return { message: 'Cart cleared' };
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
