// routes/inviteRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../db');
const User = require('../models/User');
const Project = require('../models/Project');
const UserRole = require('../models/UserRole');
const { sendEmailWithTemplate } = require('../services/emailService');

router.post('/invite', async (req, res) => {
  const { email: rawEmail, projectId, role } = req.body;
  const email = (rawEmail || '').trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Find user by email (case-insensitive so existing users are always found)
    let user = await User.findOne({
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('email')), email)
    });
    const wasExistingUser = !!user;

    // If the user does not exist, create a new user
    if (!user) {
      const password = uuidv4(); // Generate a random password
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({ email, password: hashedPassword });

      // Send welcome email with the password using the template
      const placeholders = { password, email };
      const templateId = 4; // Invite email template (new user)
      await sendEmailWithTemplate(templateId, email, placeholders);
    }

    // Check if the project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Assign the user to the project (create or update role)
    const [userRole, created] = await UserRole.findOrCreate({
      where: { UserId: user.id, ProjectId: projectId },
      defaults: { role }
    });
    if (!created) {
      await userRole.update({ role });
    }

    // Always send "added to project" email for existing users (new project or role change)
    if (wasExistingUser) {
      try {
        const placeholders = {
          name: user.name || user.email,
          email: user.email,
          projectName: project.name,
          role
        };
        const templateId = 7; // Project assignment email template (existing user added to project)
        await sendEmailWithTemplate(templateId, user.email, placeholders);
      } catch (emailError) {
        console.error('Error sending project assignment email:', emailError);
      }
    }

    res.status(200).json({ message: 'User invited and assigned to project successfully', userRole });
  } catch (error) {
    console.error('Error inviting user:', error);
    res.status(500).json({ error: 'Failed to invite user' });
  }
});

module.exports = router;
