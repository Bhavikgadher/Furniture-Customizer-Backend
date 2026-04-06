// src/database/models/CartItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  cart_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  saved_design_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'cart_items',
  timestamps: false
});

module.exports = CartItem;
