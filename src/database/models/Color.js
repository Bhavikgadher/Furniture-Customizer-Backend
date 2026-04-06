// src/database/models/Color.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Color = sequelize.define('Color', {
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
  hex_code: {
    type: DataTypes.STRING(7),
    allowNull: true
  },
  price_modifier: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
}, {
  tableName: 'colors',
  timestamps: true,
  underscored: true
});

module.exports = Color;
