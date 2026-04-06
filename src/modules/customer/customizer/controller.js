// src/modules/customer/customizer/controller.js
const service = require('./service');

const getProductOptions = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getProductOptions(req.params.id) }); } catch (e) { next(e); }
};
const calculatePrice = async (req, res, next) => {
  try { res.json({ success: true, data: await service.calculatePrice(req.body) }); } catch (e) { next(e); }
};
const saveDesign = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await service.saveDesign(req.user.id, req.body), message: 'Design saved' }); } catch (e) { next(e); }
};
const listDesigns = async (req, res, next) => {
  try { res.json({ success: true, data: await service.listDesigns(req.user.id) }); } catch (e) { next(e); }
};
const getDesignById = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getDesignById(req.user.id, req.params.id) }); } catch (e) { next(e); }
};
const deleteDesign = async (req, res, next) => {
  try { const r = await service.deleteDesign(req.user.id, req.params.id); res.json({ success: true, message: r.message }); } catch (e) { next(e); }
};

module.exports = { getProductOptions, calculatePrice, saveDesign, listDesigns, getDesignById, deleteDesign };
