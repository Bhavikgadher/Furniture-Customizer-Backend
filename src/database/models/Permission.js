// src/database/models/Permission.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  module: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'permissions',
  timestamps: true,
  underscored: true
});

module.exports = Permission;
