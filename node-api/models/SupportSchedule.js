const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const SupportTeam = require('./SupportTeam');
const User = require('./User');

const SupportSchedule = sequelize.define('SupportSchedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  escalationLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Many-to-One relationship between SupportSchedule and SupportTeam
SupportSchedule.belongsTo(SupportTeam, {
  foreignKey: {
    allowNull: false,
  },
});

// Many-to-One relationship between SupportSchedule and User
SupportSchedule.belongsTo(User, {
  foreignKey: {
    allowNull: false,
  },
});

module.exports = SupportSchedule;
