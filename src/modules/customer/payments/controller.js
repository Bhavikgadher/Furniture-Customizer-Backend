// src/modules/customer/payments/controller.js
const service = require('./service');

const initiatePayment = async (req, res, next) => {
  try { res.json({ success: true, data: await service.initiatePayment(req.user.id, req.body) }); } catch (e) { next(e); }
};
const verifyPayment = async (req, res, next) => {
  try { const r = await service.verifyPayment(req.user.id, req.body); res.json({ success: true, message: r.message, data: r }); } catch (e) { next(e); }
};
const getPaymentHistory = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getPaymentHistory(req.user.id) }); } catch (e) { next(e); }
};

module.exports = { initiatePayment, verifyPayment, getPaymentHistory };
