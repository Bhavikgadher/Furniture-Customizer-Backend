// src/database/models/InventoryLog.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const InventoryLog = sequelize.define('InventoryLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  material_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  change_type: {
    type: DataTypes.ENUM('IN', 'OUT'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reference_id: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'inventory_logs',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = InventoryLog;
