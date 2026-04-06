// src/modules/order/service.js
const { Order, User, OrderItem } = require('../../database/models');
const { Op } = require('sequelize');
const { AppError } = require('../../middlewares/errorHandler');

const getStats = async () => {
  const total = await Order.count();
  const pending = await Order.count({ where: { status: 'pending' } });
  const completed = await Order.count({ where: { status: 'delivered' } });
  const totalRevenue = await Order.sum('final_amount', { where: { payment_status: 'paid' } }) || 0;

  return {
    stats: {
      total,
      pending,
      completed,
      totalRevenue: parseFloat(totalRevenue)
    }
  };
};

const listOrders = async (filters) => {
  const { page = 1, limit = 10, status, payment, dateFrom, dateTo } = filters;
  const offset = (page - 1) * limit;

  const where = {};
  if (status) where.status = status;
  if (payment) where.payment_status = payment;
  
  if (dateFrom || dateTo) {
    where.created_at = {};
    if (dateFrom) where.created_at[Op.gte] = new Date(dateFrom);
    if (dateTo) where.created_at[Op.lte] = new Date(dateTo);
  }

  const { count, rows } = await Order.findAndCountAll({
    where,
    include: [{ model: User, as: 'customer', attributes: ['full_name'] }],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']]
  });

  return {
    orders: rows.map(order => ({
      id: order.id,
      orderNumber: `ORD-${order.id.substring(0, 8).toUpperCase()}`,
      customerName: order.customer?.full_name || 'N/A',
      total: parseFloat(order.final_amount),
      paymentStatus: order.payment_status,
      orderStatus: order.status,
      createdAt: order.created_at
    })),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
};

const getOrderById = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [
      { model: User, as: 'customer' },
      { model: OrderItem, foreignKey: 'order_id' }
    ]
  });

  if (!order) {
    throw new AppError('Order not found', 'ORDER_NOT_FOUND', 404);
  }

  return {
    order: {
      id: order.id,
      orderNumber: `ORD-${order.id.substring(0, 8).toUpperCase()}`,
      customer: {
        name: order.customer?.full_name,
        email: order.customer?.email
      },
      totalAmount: parseFloat(order.total_amount),
      taxAmount: parseFloat(order.tax_amount),
      discountAmount: parseFloat(order.discount_amount),
      finalAmount: parseFloat(order.final_amount),
      status: order.status,
      paymentStatus: order.payment_status,
      items: order.OrderItems || [],
      createdAt: order.created_at
    }
  };
};

const createOrder = async (orderData) => {
  const { userId, customerId, customerName, total, paymentStatus, orderStatus } = orderData;

  // Use userId or customerId, whichever is provided
  const finalUserId = userId || customerId;

  if (!finalUserId) {
    throw new AppError('User ID or Customer ID is required', 'USER_ID_REQUIRED', 400);
  }

  // Verify user exists
  const user = await User.findByPk(finalUserId);
  if (!user) {
    throw new AppError('User not found', 'USER_NOT_FOUND', 404);
  }

  const order = await Order.create({
    user_id: finalUserId,
    total_amount: total,
    tax_amount: 0,
    discount_amount: 0,
    final_amount: total,
    status: orderStatus || 'pending',
    payment_status: paymentStatus || 'pending'
  });

  return {
    order: {
      id: order.id,
      orderNumber: `ORD-${order.id.substring(0, 8).toUpperCase()}`,
      userId: order.user_id,
      customerName: user.full_name,
      total: parseFloat(order.final_amount),
      status: order.status,
      paymentStatus: order.payment_status,
      createdAt: order.created_at
    }
  };
};

const updateOrder = async (orderId, orderData) => {
  const order = await Order.findByPk(orderId);
  if (!order) {
    throw new AppError('Order not found', 'ORDER_NOT_FOUND', 404);
  }

  const { total, paymentStatus, orderStatus } = orderData;

  const updateData = {};
  if (total) {
    updateData.total_amount = total;
    updateData.final_amount = total;
  }
  if (paymentStatus) updateData.payment_status = paymentStatus;
  if (orderStatus) updateData.status = orderStatus;

  await order.update(updateData);

  return {
    order: {
      id: order.id,
      status: order.status,
      paymentStatus: order.payment_status
    }
  };
};

const updateOrderStatus = async (orderId, status, reason) => {
  const order = await Order.findByPk(orderId);
  if (!order) {
    throw new AppError('Order not found', 'ORDER_NOT_FOUND', 404);
  }

  await order.update({ status });

  return { message: 'Order status updated successfully' };
};

const getInvoice = async (orderId) => {
  const order = await Order.findByPk(orderId);
  if (!order) {
    throw new AppError('Order not found', 'ORDER_NOT_FOUND', 404);
  }

  return { message: 'Invoice generation not yet implemented' };
};

const exportOrders = async (filters) => {
  return { message: 'Export not yet implemented' };
};

module.exports = {
  getStats,
  listOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  getInvoice,
  exportOrders
};
