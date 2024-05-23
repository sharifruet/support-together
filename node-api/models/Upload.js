const { DataTypes } = require('sequelize');
const db = require('../db');

const Upload = db.define('Upload', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contentType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contentLength: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Upload;
