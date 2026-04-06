// src/database/models/Consultation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Consultation = sequelize.define('Consultation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  designer_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  scheduled_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'consultations',
  timestamps: true,
  underscored: true
});

module.exports = Consultation;
