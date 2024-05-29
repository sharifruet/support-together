// routes/inviteRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Project = require('../models/Project');
const UserRole = require('../models/UserRole');
const { sendEmailWithTemplate } = require('../services/emailService');

router.post('/invite', async (req, res) => {
  const { email, projectId, role } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ where: { email } });

    // If the user does not exist, create a new user
    if (!user) {
      const password = uuidv4(); // Generate a random password
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({ email, password: hashedPassword });

      // Send welcome email with the password using the template
      const placeholders = { password };
      const templateId = 4; // Assuming 1 is the template ID for the invite email
      await sendEmailWithTemplate(templateId, email, placeholders);
    }

    // Check if the project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Assign the user to the project with the specified role
    const userRole = await UserRole.create({ UserId: user.id, ProjectId: projectId, role });

    res.status(200).json({ message: 'User invited and assigned to project successfully', userRole });
  } catch (error) {
    console.error('Error inviting user:', error);
    res.status(500).json({ error: 'Failed to invite user' });
  }
});

module.exports = router;
