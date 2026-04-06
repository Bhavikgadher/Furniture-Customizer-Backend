// src/database/models/Designer.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Designer = sequelize.define('Designer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  experience_years: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0
  }
}, {
  tableName: 'designers',
  timestamps: true,
  underscored: true
});

module.exports = Designer;
