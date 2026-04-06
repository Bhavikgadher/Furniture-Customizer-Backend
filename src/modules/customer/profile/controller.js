// src/modules/customer/profile/controller.js
const service = require('./service');

const getProfile = async (req, res, next) => {
  try { res.json({ success: true, data: await service.getProfile(req.user.id) }); } catch (e) { next(e); }
};

const updateProfile = async (req, res, next) => {
  try { res.json({ success: true, data: await service.updateProfile(req.user.id, req.body), message: 'Profile updated' }); } catch (e) { next(e); }
};

const changePassword = async (req, res, next) => {
  try { const r = await service.changePassword(req.user.id, req.body); res.json({ success: true, message: r.message }); } catch (e) { next(e); }
};

const listAddresses = async (req, res, next) => {
  try { res.json({ success: true, data: await service.listAddresses(req.user.id) }); } catch (e) { next(e); }
};

const addAddress = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await service.addAddress(req.user.id, req.body), message: 'Address added' }); } catch (e) { next(e); }
};

const updateAddress = async (req, res, next) => {
  try { res.json({ success: true, data: await service.updateAddress(req.user.id, req.params.id, req.body), message: 'Address updated' }); } catch (e) { next(e); }
};

const deleteAddress = async (req, res, next) => {
  try { const r = await service.deleteAddress(req.user.id, req.params.id); res.json({ success: true, message: r.message }); } catch (e) { next(e); }
};

const setDefaultAddress = async (req, res, next) => {
  try { const r = await service.setDefaultAddress(req.user.id, req.params.id); res.json({ success: true, message: r.message }); } catch (e) { next(e); }
};

module.exports = { getProfile, updateProfile, changePassword, listAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress };
