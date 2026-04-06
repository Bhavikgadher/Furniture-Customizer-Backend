// src/database/models/Material.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Material = sequelize.define('Material', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  price_multiplier: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 1
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'materials',
  timestamps: true,
  underscored: true
});

module.exports = Material;
