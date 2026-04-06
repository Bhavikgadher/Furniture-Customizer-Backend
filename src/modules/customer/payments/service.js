// src/modules/customer/payments/service.js
const { Payment, Order } = require('../../../database/models');
const { AppError } = require('../../../middlewares/errorHandler');

const initiatePayment = async (userId, { order_id, payment_method }) => {
  const order = await Order.findOne({ where: { id: order_id, user_id: userId } });
  if (!order) throw new AppError('Order not found', 'ORDER_NOT_FOUND', 404);
  if (order.payment_status === 'paid') throw new AppError('Order already paid', 'ALREADY_PAID', 400);

  const payment = await Payment.findOne({ where: { order_id } });
  if (payment) await payment.update({ payment_method });

  // In production, integrate with Razorpay/Stripe here and return payment gateway data
  return {
    orderId: order.id,
    amount: parseFloat(order.final_amount),
    paymentMethod: payment_method,
    status: 'pending',
    message: 'Proceed with payment using the provided details'
  };
};

const verifyPayment = async (userId, { order_id, transaction_id }) => {
  const order = await Order.findOne({ where: { id: order_id, user_id: userId } });
  if (!order) throw new AppError('Order not found', 'ORDER_NOT_FOUND', 404);

  const payment = await Payment.findOne({ where: { order_id } });
  if (!payment) throw new AppError('Payment record not found', 'PAYMENT_NOT_FOUND', 404);

  await payment.update({ transaction_id, status: 'paid', paid_at: new Date() });
  await order.update({ payment_status: 'paid', status: 'confirmed' });

  return { message: 'Payment verified successfully', paymentStatus: 'paid' };
};

const getPaymentHistory = async (userId) => {
  const orders = await Order.findAll({ where: { user_id: userId }, include: [{ model: Payment }], order: [['created_at', 'DESC']] });
  return {
    payments: orders.filter(o => o.Payment).map(o => ({
      orderId: o.id,
      orderNumber: `ORD-${o.id.substring(0, 8).toUpperCase()}`,
      amount: parseFloat(o.Payment.amount),
      method: o.Payment.payment_method,
      status: o.Payment.status,
      paidAt: o.Payment.paid_at
    }))
  };
};

module.exports = { initiatePayment, verifyPayment, getPaymentHistory };
