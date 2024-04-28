// models/Project.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Organization = require('./Organization');

const Project = sequelize.define('Project', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: 'Project code must be unique within an organization'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Define association with Organization
Project.belongsTo(Organization, {
  foreignKey: {
    allowNull: false
  }
});

module.exports = Project;
