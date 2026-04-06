// src/database/models/Size.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Size = sequelize.define('Size', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  width: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  height: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  depth: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  price_multiplier: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 1
  }
}, {
  tableName: 'sizes',
  timestamps: true,
  underscored: true
});

module.exports = Size;
