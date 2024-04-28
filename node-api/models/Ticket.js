// models/Ticket.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Topic = require('./Topic');

const Ticket = sequelize.define('Ticket', {
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
    allowNull: false
  },
  fyiTo: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  assignedTo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  escalationLevel: {
    type: DataTypes.ENUM('L1', 'L2', 'L3'),
    allowNull: true
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  }
});

// Define association with Topic
Ticket.belongsTo(Topic, {
  foreignKey: {
    allowNull: false
  }
});

module.exports = Ticket;
