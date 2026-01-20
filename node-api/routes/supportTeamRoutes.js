const express = require('express');
const router = express.Router();
const SupportTeam = require('../models/SupportTeam');
const User = require('../models/User');
const SupportTeamMembers = require('../models/SupportTeamMembers');
const { requireAdmin } = require('../middleware/roleMiddleware');

// Create a new support team
router.post('/support-teams', requireAdmin(), async (req, res) => {
  try {
    const { name, userIds } = req.body;

    const supportTeam = await SupportTeam.create({ name });

    // Add users to the support team
    if (userIds && userIds.length > 0) {
      const users = await User.findAll({ where: { id: userIds } });
      await supportTeam.addUsers(users);
    }

    res.status(201).json(supportTeam);
  } catch (error) {
    console.error('Error creating support team:', error);
    res.status(500).json({ error: 'Failed to create support team' });
  }
});

// Get all support teams
router.get('/support-teams', async (req, res) => {
  try {
    const supportTeams = await SupportTeam.findAll({ include: [ User] });
    res.json(supportTeams);
  } catch (error) {
    console.error('Error fetching support teams:', error);
    res.status(500).json({ error: 'Failed to fetch support teams' });
  }
});

// Get a single support team by ID
router.get('/support-teams/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const supportTeam = await SupportTeam.findByPk(id, { include: [ User] });
    if (!supportTeam) {
      return res.status(404).json({ error: 'Support team not found' });
    }
    res.json(supportTeam);
  } catch (error) {
    console.error('Error fetching support team:', error);
    res.status(500).json({ error: 'Failed to fetch support team' });
  }
});

// Update a support team
router.put('/support-teams/:id', requireAdmin(), async (req, res) => {
  const { id } = req.params;
  const { name, userIds } = req.body;
  try {
    const supportTeam = await SupportTeam.findByPk(id);
    if (!supportTeam) {
      return res.status(404).json({ error: 'Support team not found' });
    }

    await supportTeam.update({ name });

    // Update users in the support team
    if (userIds && userIds.length > 0) {
      const users = await User.findAll({ where: { id: userIds } });
      await supportTeam.setUsers(users);
    }

    res.json({ message: 'Support team updated successfully' });
  } catch (error) {
    console.error('Error updating support team:', error);
    res.status(500).json({ error: 'Failed to update support team' });
  }
});

// Delete a support team
router.delete('/support-teams/:id', requireAdmin(), async (req, res) => {
  const { id } = req.params;
  try {
    const supportTeam = await SupportTeam.findByPk(id);
    if (!supportTeam) {
      return res.status(404).json({ error: 'Support team not found' });
    }

    await supportTeam.destroy();
    res.json({ message: 'Support team deleted successfully' });
  } catch (error) {
    console.error('Error deleting support team:', error);
    res.status(500).json({ error: 'Failed to delete support team' });
  }
});

module.exports = router;
