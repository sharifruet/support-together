// models/Ticket.js
const { DataTypes } = require('sequelize');
const db = require('../db');

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
