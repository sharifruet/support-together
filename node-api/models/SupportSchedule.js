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
    comment: 'Start time of the support schedule (HH:MM:SS)'
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: 'End time of the support schedule (HH:MM:SS)'
  },
  escalationLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Escalation level (1, 2, or 3)'
  },
}, {
  indexes: [
    // Index for efficient lookup by support team and time range
    {
      name: 'idx_support_team_time',
      fields: ['SupportTeamId', 'startTime', 'endTime']
    },
    // Index for escalation level queries
    {
      name: 'idx_escalation_level',
      fields: ['escalationLevel']
    },
    // Composite index for common query pattern (team + level)
    {
      name: 'idx_team_level',
      fields: ['SupportTeamId', 'escalationLevel']
    },
    // Index for user lookups
    {
      name: 'idx_user_id',
      fields: ['UserId']
    }
  ],
  comment: 'Support schedules defining time slots and escalation levels for support teams'
});

// Many-to-One relationship between SupportSchedule and SupportTeam
SupportSchedule.belongsTo(SupportTeam, {
  foreignKey: {
    allowNull: false,
    name: 'SupportTeamId'
  },
});

// Many-to-One relationship between SupportSchedule and User
SupportSchedule.belongsTo(User, {
  foreignKey: {
    allowNull: false,
    name: 'UserId'
  },
});

module.exports = SupportSchedule;
