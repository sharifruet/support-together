const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const SupportTeam = sequelize.define('SupportTeam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Many-to-Many relationship between SupportTeam and User
SupportTeam.belongsToMany(User, { through: 'SupportTeamMembers' });
User.belongsToMany(SupportTeam, { through: 'SupportTeamMembers' });

module.exports = SupportTeam;
