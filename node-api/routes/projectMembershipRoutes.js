// routes/projectMembershipRoutes.js

const express = require('express');
const router = express.Router();
const UserRole = require('../models/UserRole');
const User = require('../models/User');
const Project = require('../models/Project');

// Get roles of a user for all projects
router.get('/project-memberships/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const userRoles = await UserRole.findAll({ where: { UserId: userId }, include: Project });
    res.json(userRoles);
  } catch (error) {
    console.error('Error fetching user roles:', error);
    res.status(500).json({ error: 'Failed to fetch user roles' });
  }
});

module.exports = router;
