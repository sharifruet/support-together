// routes/userRoleRoutes.js

const express = require('express');
const router = express.Router();
const UserRole = require('../models/UserRole');
const User = require('../models/User');
const Project = require('../models/Project');
const { requireAdmin, checkProjectAccess } = require('../middleware/roleMiddleware');
const { sendEmailWithTemplate } = require('../services/emailService');

// Get user roles (users and roles) for a project
router.get('/user-roles/project/:projectId', checkProjectAccess, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userRoles = await UserRole.findAll({
      where: { ProjectId: projectId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    });
    res.json(userRoles);
  } catch (error) {
    console.error('Error fetching user roles by project:', error);
    res.status(500).json({ error: 'Failed to fetch user roles' });
  }
});

// Assign role to user for a project
router.post('/user-roles', requireAdmin(), async (req, res) => {
  try {
    const { userId, projectId, role } = req.body;
    // Check if the user and project exist
    const user = await User.findByPk(userId);
    const project = await Project.findByPk(projectId);
    if (!user || !project) {
      return res.status(404).json({ error: 'User or project not found' });
    }
    const userRole = await UserRole.create({ UserId: userId, ProjectId: projectId, role });

    // Notify user by email that they have been added to the project
    try {
      const placeholders = {
        name: user.name || user.email,
        email: user.email,
        projectName: project.name,
        role
      };
      const templateId = 7; // Project assignment email template
      await sendEmailWithTemplate(templateId, user.email, placeholders);
    } catch (emailError) {
      console.error('Error sending project assignment email:', emailError);
    }

    res.status(201).json(userRole);
  } catch (error) {
    console.error('Error assigning role to user:', error);
    res.status(500).json({ error: 'Failed to assign role to user' });
  }
});

// Update user role for a project
router.put('/user-roles/:id', requireAdmin(), async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const userRole = await UserRole.findByPk(id);
    if (!userRole) {
      return res.status(404).json({ error: 'User role not found' });
    }
    await userRole.update({ role });
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Delete user role for a project
router.delete('/user-roles/:id', requireAdmin(), async (req, res) => {
  const { id } = req.params;
  try {
    const userRole = await UserRole.findByPk(id);
    if (!userRole) {
      return res.status(404).json({ error: 'User role not found' });
    }
    await userRole.destroy();
    res.json({ message: 'User role deleted successfully' });
  } catch (error) {
    console.error('Error deleting user role:', error);
    res.status(500).json({ error: 'Failed to delete user role' });
  }
});

module.exports = router;
