// src/database/models/Coupon.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  discount_type: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: false,
    defaultValue: 'percentage'
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  max_discount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  min_order_value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  expiry_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  usage_limit: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'coupons',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Coupon;
