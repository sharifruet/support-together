const { DataTypes } = require('sequelize');
const db = require('../db');
const User = require('./User'); // Assuming User model is defined in './User'

const Ticket = db.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true
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
    type: DataTypes.ENUM('Created', 'Assigned', 'In Progress', 'Resolved', 'Closed'),
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
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  createdBy: {
    type: DataTypes.INTEGER,
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
  },
  assignedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp when ticket was assigned to current assignee'
  },
  acknowledgedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp when ticket was acknowledged by assignee'
  }
  
});

module.exports = Ticket;
