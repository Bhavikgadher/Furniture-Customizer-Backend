// src/modules/customer/profile/service.js
const bcrypt = require('bcryptjs');
const { User, UserAddress } = require('../../../database/models');
const { AppError } = require('../../../middlewares/errorHandler');

const getProfile = async (userId) => {
  const user = await User.findByPk(userId, { attributes: ['id', 'full_name', 'email', 'phone', 'is_verified', 'created_at'] });
  if (!user) throw new AppError('User not found', 'USER_NOT_FOUND', 404);
  return { user };
};

const updateProfile = async (userId, { full_name, phone }) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('User not found', 'USER_NOT_FOUND', 404);
  const data = {};
  if (full_name) data.full_name = full_name;
  if (phone !== undefined) data.phone = phone;
  await user.update(data);
  return { user: { id: user.id, full_name: user.full_name, phone: user.phone } };
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError('User not found', 'USER_NOT_FOUND', 404);
  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) throw new AppError('Current password is incorrect', 'INVALID_PASSWORD', 400);
  await user.update({ password_hash: await bcrypt.hash(newPassword, 10) });
  return { message: 'Password changed successfully' };
};

const listAddresses = async (userId) => {
  const addresses = await UserAddress.findAll({ where: { user_id: userId }, order: [['is_default', 'DESC']] });
  return { addresses };
};

const addAddress = async (userId, data) => {
  if (data.is_default) {
    await UserAddress.update({ is_default: false }, { where: { user_id: userId } });
  }
  const address = await UserAddress.create({ ...data, user_id: userId });
  return { address };
};

const updateAddress = async (userId, addressId, data) => {
  const address = await UserAddress.findOne({ where: { id: addressId, user_id: userId } });
  if (!address) throw new AppError('Address not found', 'ADDRESS_NOT_FOUND', 404);
  if (data.is_default) {
    await UserAddress.update({ is_default: false }, { where: { user_id: userId } });
  }
  await address.update(data);
  return { address };
};

const deleteAddress = async (userId, addressId) => {
  const address = await UserAddress.findOne({ where: { id: addressId, user_id: userId } });
  if (!address) throw new AppError('Address not found', 'ADDRESS_NOT_FOUND', 404);
  await address.destroy();
  return { message: 'Address deleted successfully' };
};

const setDefaultAddress = async (userId, addressId) => {
  const address = await UserAddress.findOne({ where: { id: addressId, user_id: userId } });
  if (!address) throw new AppError('Address not found', 'ADDRESS_NOT_FOUND', 404);
  await UserAddress.update({ is_default: false }, { where: { user_id: userId } });
  await address.update({ is_default: true });
  return { message: 'Default address updated' };
};

module.exports = { getProfile, updateProfile, changePassword, listAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress };
