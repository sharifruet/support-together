// models/Attachment.js
const { DataTypes } = require('sequelize');
const db = require('../db');

const Attachment = db.define('Attachment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ticketId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Attachment;
 