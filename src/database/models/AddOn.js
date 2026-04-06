// src/database/models/AddOn.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const AddOn = sequelize.define('AddOn', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  tableName: 'add_ons',
  timestamps: true,
  underscored: true
});

module.exports = AddOn;
