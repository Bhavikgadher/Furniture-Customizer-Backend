// src/modules/customer/checkout/service.js
const { Cart, CartItem, SavedDesign, FurnitureModel, Order, OrderItem, UserAddress, Coupon, CouponUsage, Payment } = require('../../../database/models');
const { AppError } = require('../../../middlewares/errorHandler');
const { Op } = require('sequelize');

const validateCart = async (userId) => {
  const cart = await Cart.findOne({ where: { user_id: userId } });
  if (!cart) throw new AppError('Cart is empty', 'CART_EMPTY', 400);

  const items = await CartItem.findAll({ where: { cart_id: cart.id }, include: [{ model: SavedDesign }] });
  if (!items.length) throw new AppError('Cart is empty', 'CART_EMPTY', 400);

  const total = items.reduce((sum, item) => sum + parseFloat(item.SavedDesign?.calculated_price || 0) * item.quantity, 0);
  return { valid: true, itemCount: items.length, total: parseFloat(total.toFixed(2)) };
};

const applyCoupon = async (userId, { code, orderTotal }) => {
  const coupon = await Coupon.findOne({ where: { code } });
  if (!coupon) throw new AppError('Invalid coupon code', 'INVALID_COUPON', 400);
  if (coupon.expiry_date && new Date() > coupon.expiry_date) throw new AppError('Coupon has expired', 'COUPON_EXPIRED', 400);
  if (coupon.min_order_value && orderTotal < parseFloat(coupon.min_order_value)) {
    throw new AppError(`Minimum order value is ${coupon.min_order_value}`, 'MIN_ORDER_NOT_MET', 400);
  }

  const usageCount = await CouponUsage.count({ where: { coupon_id: coupon.id } });
  if (coupon.usage_limit && usageCount >= coupon.usage_limit) throw new AppError('Coupon usage limit reached', 'COUPON_LIMIT_REACHED', 400);

  const alreadyUsed = await CouponUsage.findOne({ where: { coupon_id: coupon.id, user_id: userId } });
  if (alreadyUsed) throw new AppError('Coupon already used', 'COUPON_ALREADY_USED', 400);

  let discount = coupon.discount_type === 'percentage'
    ? (orderTotal * parseFloat(coupon.value)) / 100
    : parseFloat(coupon.value);

  if (coupon.max_discount) discount = Math.min(discount, parseFloat(coupon.max_discount));

  return { couponId: coupon.id, discount: parseFloat(discount.toFixed(2)), finalTotal: parseFloat((orderTotal - discount).toFixed(2)) };
};

const createOrder = async (userId, { address_id, coupon_code }) => {
  const cart = await Cart.findOne({ where: { user_id: userId } });
  if (!cart) throw new AppError('Cart is empty', 'CART_EMPTY', 400);

  const items = await CartItem.findAll({
    where: { cart_id: cart.id },
    include: [{ model: SavedDesign, include: [{ model: FurnitureModel, as: 'model' }] }]
  });
  if (!items.length) throw new AppError('Cart is empty', 'CART_EMPTY', 400);

  if (address_id) {
    const address = await UserAddress.findOne({ where: { id: address_id, user_id: userId } });
    if (!address) throw new AppError('Address not found', 'ADDRESS_NOT_FOUND', 404);
  }

  let total = items.reduce((sum, item) => sum + parseFloat(item.SavedDesign?.calculated_price || 0) * item.quantity, 0);
  let discount = 0;
  let couponId = null;

  if (coupon_code) {
    const couponResult = await applyCoupon(userId, { code: coupon_code, orderTotal: total });
    discount = couponResult.discount;
    couponId = couponResult.couponId;
  }

  const final = total - discount;

  const order = await Order.create({
    user_id: userId,
    address_id: address_id || null,
    total_amount: parseFloat(total.toFixed(2)),
    tax_amount: 0,
    discount_amount: parseFloat(discount.toFixed(2)),
    final_amount: parseFloat(final.toFixed(2)),
    status: 'pending',
    payment_status: 'pending'
  });

  await OrderItem.bulkCreate(items.map(item => ({
    order_id: order.id,
    model_id: item.SavedDesign.model_id,
    snapshot_data: {
      design_id: item.SavedDesign.id,
      material: item.SavedDesign.selected_material,
      color: item.SavedDesign.selected_color,
      fabric: item.SavedDesign.selected_fabric,
      size: item.SavedDesign.selected_size
    },
    quantity: item.quantity,
    unit_price: parseFloat(item.SavedDesign.calculated_price),
    total_price: parseFloat(item.SavedDesign.calculated_price) * item.quantity
  })));

  if (couponId) {
    await CouponUsage.create({ coupon_id: couponId, user_id: userId, order_id: order.id });
  }

  await Payment.create({ order_id: order.id, amount: parseFloat(final.toFixed(2)), status: 'pending' });

  await CartItem.destroy({ where: { cart_id: cart.id } });

  return { order: { id: order.id, orderNumber: `ORD-${order.id.substring(0, 8).toUpperCase()}`, total: parseFloat(order.final_amount), status: order.status } };
};

module.exports = { validateCart, applyCoupon, createOrder };
