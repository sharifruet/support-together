// models/Topic.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Project = require('./Project');

const Topic = sequelize.define('Topic', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true // Description is optional
  },
  supportTeamId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
});

// Define association with Project
Topic.belongsTo(Project, {
  foreignKey: {
    allowNull: false
  }
});

module.exports = Topic;
