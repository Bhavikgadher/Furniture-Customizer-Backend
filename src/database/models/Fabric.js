// src/database/models/Fabric.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Fabric = sequelize.define('Fabric', {
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
  }
}, {
  tableName: 'fabrics',
  timestamps: true,
  underscored: true
});

module.exports = Fabric;
