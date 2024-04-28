// models/Organization.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Organization = sequelize.define('Organization', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Organization;
