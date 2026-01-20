const express = require('express');
const router = express.Router();
const SupportSchedule  = require('../models/SupportSchedule');
const SupportTeam  = require('../models/SupportTeam');
const User  = require('../models/User');
const { requireAdmin } = require('../middleware/roleMiddleware');
const { findSchedulesByTeam, clearScheduleCache } = require('../services/scheduleQueryService');

// Create a new support schedule
router.post('/support-schedules', requireAdmin(), async (req, res) => {
  try {
    const { startTime, endTime, escalationLevel, supportTeamId, userId } = req.body;

    const supportSchedule = await SupportSchedule.create({
      startTime,
      endTime,
      escalationLevel,
      SupportTeamId: supportTeamId,
      UserId: userId,
    });

    // Clear cache for this support team
    clearScheduleCache(supportTeamId);

    res.status(201).json(supportSchedule);
  } catch (error) {
    console.error('Error creating support schedule:', error);
    res.status(500).json({ error: 'Failed to create support schedule' });
  }
});

// Get all support schedules (with pagination and filtering)
router.get('/support-schedules', async (req, res) => {
  try {
    const { 
      supportTeamId, 
      escalationLevel, 
      page = 1, 
      limit = 50,
      includeTeam = 'true',
      includeUser = 'true'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const whereClause = {};

    // Filter by support team if provided
    if (supportTeamId) {
      whereClause.SupportTeamId = parseInt(supportTeamId);
    }

    // Filter by escalation level if provided
    if (escalationLevel) {
      whereClause.escalationLevel = parseInt(escalationLevel);
    }

    // Build include options
    const includeOptions = [];
    if (includeTeam === 'true') {
      includeOptions.push({
        model: SupportTeam,
        attributes: ['id', 'name'],
        required: false
      });
    }
    if (includeUser === 'true') {
      includeOptions.push({
        model: User,
        attributes: ['id', 'name', 'email'],
        required: false
      });
    }

    // Optimized query with pagination
    const { count, rows } = await SupportSchedule.findAndCountAll({
      where: whereClause,
      include: includeOptions,
      order: [['SupportTeamId', 'ASC'], ['escalationLevel', 'ASC'], ['startTime', 'ASC']],
      limit: parseInt(limit),
      offset: offset,
      distinct: true // Important for count with includes
    });

    res.json({
      schedules: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching support schedules:', error);
    res.status(500).json({ error: 'Failed to fetch support schedules' });
  }
});

// Get a single support schedule by ID
router.get('/support-schedules/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const supportSchedule = await SupportSchedule.findByPk(id, { include: [SupportTeam, User] });
    if (!supportSchedule) {
      return res.status(404).json({ error: 'Support schedule not found' });
    }
    res.json(supportSchedule);
  } catch (error) {
    console.error('Error fetching support schedule:', error);
    res.status(500).json({ error: 'Failed to fetch support schedule' });
  }
});

// Update a support schedule
router.put('/support-schedules/:id', requireAdmin(), async (req, res) => {
  const { id } = req.params;
  const { startTime, endTime, escalationLevel, supportTeamId, userId } = req.body;
  try {
    const supportSchedule = await SupportSchedule.findByPk(id);
    if (!supportSchedule) {
      return res.status(404).json({ error: 'Support schedule not found' });
    }

    const oldTeamId = supportSchedule.SupportTeamId;

    await supportSchedule.update({
      startTime,
      endTime,
      escalationLevel,
      SupportTeamId: supportTeamId,
      UserId: userId,
    });

    // Clear cache for both old and new team IDs
    clearScheduleCache(oldTeamId);
    if (supportTeamId && supportTeamId !== oldTeamId) {
      clearScheduleCache(supportTeamId);
    }

    res.json({ message: 'Support schedule updated successfully' });
  } catch (error) {
    console.error('Error updating support schedule:', error);
    res.status(500).json({ error: 'Failed to update support schedule' });
  }
});

// Delete a support schedule
router.delete('/support-schedules/:id', requireAdmin(), async (req, res) => {
  const { id } = req.params;
  try {
    const supportSchedule = await SupportSchedule.findByPk(id);
    if (!supportSchedule) {
      return res.status(404).json({ error: 'Support schedule not found' });
    }

    const teamId = supportSchedule.SupportTeamId;

    await supportSchedule.destroy();

    // Clear cache for this support team
    clearScheduleCache(teamId);
    res.json({ message: 'Support schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting support schedule:', error);
    res.status(500).json({ error: 'Failed to delete support schedule' });
  }
});

// Get schedules for a specific support team (optimized endpoint)
router.get('/support-schedules/team/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    const { escalationLevel, includeUser = 'true', includeTeam = 'false' } = req.query;

    const schedules = await findSchedulesByTeam(parseInt(teamId), {
      escalationLevels: escalationLevel ? [parseInt(escalationLevel)] : null,
      includeUser: includeUser === 'true',
      includeTeam: includeTeam === 'true'
    });

    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules by team:', error);
    res.status(500).json({ error: 'Failed to fetch schedules by team' });
  }
});

module.exports = router;
