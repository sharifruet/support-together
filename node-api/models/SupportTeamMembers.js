const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const SupportTeam = require('./SupportTeam');

const SupportTeamMembers = sequelize.define('SupportTeamMembers', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  SupportTeamId: {
    type: DataTypes.INTEGER,
    references: {
      model: SupportTeam,
      key: 'id',
    },
  },
  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
});

SupportTeam.belongsToMany(User, { through: SupportTeamMembers });
User.belongsToMany(SupportTeam, { through: SupportTeamMembers });

module.exports = SupportTeamMembers;
