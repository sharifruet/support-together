const { DataTypes } = require('sequelize');
const db = require('../db');
const User = require('./User'); // Assuming User model is defined in './User'

const Ticket = db.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('P1', 'P2', 'P3', 'P4', 'P5'),
    allowNull: false
  },
  requestedBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Created', 'Open', 'Resolved', 'Closed'),
    allowNull: false,
    defaultValue: 'Created'
  },
  assignmentStatus: {
    type: DataTypes.ENUM(
      'Assigned (L1)',
      'Assigned (L2)',
      'Assigned (L3)',
      'Acknowledged (L1)',
      'Acknowledged (L2)',
      'Acknowledged (L3)'
    ),
    allowNull: true,
    defaultValue: null
  },
  createdBy: {
    type: DataTypes.INTEGER, // Assuming createdBy is the ID of the user
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  topicId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Ticket;
