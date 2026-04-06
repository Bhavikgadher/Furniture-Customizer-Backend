// src/database/models/SavedDesign.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const SavedDesign = sequelize.define('SavedDesign', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  model_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  selected_material: {
    type: DataTypes.UUID,
    allowNull: true
  },
  selected_color: {
    type: DataTypes.UUID,
    allowNull: true
  },
  selected_fabric: {
    type: DataTypes.UUID,
    allowNull: true
  },
  selected_size: {
    type: DataTypes.UUID,
    allowNull: true
  },
  calculated_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  }
}, {
  tableName: 'saved_designs',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = SavedDesign;
