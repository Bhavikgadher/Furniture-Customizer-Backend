// src/modules/customer/orders/service.js
const { Order, OrderItem, Payment, UserAddress, FurnitureModel } = require('../../../database/models');
const { AppError } = require('../../../middlewares/errorHandler');

const listOrders = async (userId, { page = 1, limit = 10, status }) => {
  const offset = (page - 1) * limit;
  const where = { user_id: userId };
  if (status) where.status = status;

  const { count, rows } = await Order.findAndCountAll({
    where, limit: parseInt(limit), offset, order: [['created_at', 'DESC']]
  });

  return {
    orders: rows.map(o => ({
      id: o.id,
      orderNumber: `ORD-${o.id.substring(0, 8).toUpperCase()}`,
      total: parseFloat(o.final_amount),
      status: o.status,
      paymentStatus: o.payment_status,
      createdAt: o.created_at
    })),
    pagination: { page: parseInt(page), limit: parseInt(limit), total: count, totalPages: Math.ceil(count / limit) }
  };
};

const getOrderById = async (userId, orderId) => {
  const order = await Order.findOne({
    where: { id: orderId, user_id: userId },
    include: [
      { model: OrderItem, include: [{ model: FurnitureModel, foreignKey: 'model_id', attributes: ['id', 'name', 'base_image'] }] },
      { model: UserAddress, as: 'address' },
      { model: Payment }
    ]
  });
  if (!order) throw new AppError('Order not found', 'ORDER_NOT_FOUND', 404);
  return { order };
};

const cancelOrder = async (userId, orderId) => {
  const order = await Order.findOne({ where: { id: orderId, user_id: userId } });
  if (!order) throw new AppError('Order not found', 'ORDER_NOT_FOUND', 404);
  if (!['pending', 'confirmed'].includes(order.status)) {
    throw new AppError('Order cannot be cancelled at this stage', 'CANNOT_CANCEL', 400);
  }
  await order.update({ status: 'cancelled' });
  return { message: 'Order cancelled successfully' };
};

module.exports = { listOrders, getOrderById, cancelOrder };
