// src/database/models/Vendor.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Vendor = sequelize.define('Vendor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  company_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  gst_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'vendors',
  timestamps: true,
  underscored: true
});

module.exports = Vendor;
