// src/modules/customer/consultations/controller.js
const service = require('./service');

const listDesigners = async (req, res, next) => {
  try { res.json({ success: true, data: await service.listDesigners() }); } catch (e) { next(e); }
};
const bookConsultation = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await service.bookConsultation(req.user.id, req.body), message: 'Consultation booked' }); } catch (e) { next(e); }
};
const listConsultations = async (req, res, next) => {
  try { res.json({ success: true, data: await service.listConsultations(req.user.id) }); } catch (e) { next(e); }
};
const getConsultationById = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getConsultationById(req.user.id, req.params.id) }); } catch (e) { next(e); }
};
const cancelConsultation = async (req, res, next) => {
  try { const r = await service.cancelConsultation(req.user.id, req.params.id); res.json({ success: true, message: r.message }); } catch (e) { next(e); }
};

module.exports = { listDesigners, bookConsultation, listConsultations, getConsultationById, cancelConsultation };
