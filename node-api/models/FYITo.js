// models/FYITo.js
const { DataTypes } = require('sequelize');
const db = require('../db');

const FYITo = db.define('FYITo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  TicketId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = FYITo;
