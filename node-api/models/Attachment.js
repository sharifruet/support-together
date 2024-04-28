// models/Attachment.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class Attachment extends Model {}

Attachment.init({
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Attachment'
});

module.exports = Attachment;
