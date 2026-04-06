// src/database/models/WishlistItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const WishlistItem = sequelize.define('WishlistItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  wishlist_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  model_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  added_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'wishlist_items',
  timestamps: false
});

module.exports = WishlistItem;
