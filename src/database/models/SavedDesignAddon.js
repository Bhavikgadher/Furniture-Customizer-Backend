// src/database/models/SavedDesignAddon.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const SavedDesignAddon = sequelize.define('SavedDesignAddon', {
  saved_design_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  addon_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  }
}, {
  tableName: 'saved_design_addons',
  timestamps: false
});

module.exports = SavedDesignAddon;
