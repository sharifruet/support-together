// models/UserRole.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Project = require('./Project');

const UserRole = sequelize.define('UserRole', {
  role: {
    type: DataTypes.ENUM('Admin', 'Customer', 'Support'),
    allowNull: false
  }
});

// Define association with User and Project
UserRole.belongsTo(User);
UserRole.belongsTo(Project);

module.exports = UserRole;
