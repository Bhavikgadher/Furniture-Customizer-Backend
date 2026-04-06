// src/database/models/CouponUsage.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const CouponUsage = sequelize.define('CouponUsage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  coupon_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'coupon_usage',
  timestamps: false
});

module.exports = CouponUsage;
