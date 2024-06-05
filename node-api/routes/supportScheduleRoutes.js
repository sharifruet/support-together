const express = require('express');
const router = express.Router();
const SupportSchedule  = require('../models/SupportSchedule');
const SupportTeam  = require('../models/SupportTeam');
const User  = require('../models/User');

// Create a new support schedule
router.post('/support-schedules', async (req, res) => {
  try {
    const { startTime, endTime, escalationLevel, supportTeamId, userId } = req.body;

    const supportSchedule = await SupportSchedule.create({
      startTime,
      endTime,
      escalationLevel,
      SupportTeamId: supportTeamId,
      UserId: userId,
    });

    res.status(201).json(supportSchedule);
  } catch (error) {
    console.error('Error creating support schedule:', error);
    res.status(500).json({ error: 'Failed to create support schedule' });
  }
});

// Get all support schedules
router.get('/support-schedules', async (req, res) => {
  try {
    const supportSchedules = await SupportSchedule.findAll({ include: [SupportTeam, User] });
    res.json(supportSchedules);
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
router.put('/support-schedules/:id', async (req, res) => {
  const { id } = req.params;
  const { startTime, endTime, escalationLevel, supportTeamId, userId } = req.body;
  try {
    const supportSchedule = await SupportSchedule.findByPk(id);
    if (!supportSchedule) {
      return res.status(404).json({ error: 'Support schedule not found' });
    }

    await supportSchedule.update({
      startTime,
      endTime,
      escalationLevel,
      SupportTeamId: supportTeamId,
      UserId: userId,
    });

    res.json({ message: 'Support schedule updated successfully' });
  } catch (error) {
    console.error('Error updating support schedule:', error);
    res.status(500).json({ error: 'Failed to update support schedule' });
  }
});

// Delete a support schedule
router.delete('/support-schedules/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const supportSchedule = await SupportSchedule.findByPk(id);
    if (!supportSchedule) {
      return res.status(404).json({ error: 'Support schedule not found' });
    }

    await supportSchedule.destroy();
    res.json({ message: 'Support schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting support schedule:', error);
    res.status(500).json({ error: 'Failed to delete support schedule' });
  }
});

module.exports = router;
