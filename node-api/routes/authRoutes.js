const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserRole = require('../models/UserRole');
const EmailTemplate = require('../models/EmailTemplate');
const { sendEmailWithTemplate } = require('../services/emailService');
const authenticate = require('../middleware/authMiddleware');
// User registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phoneNumber, password: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});
// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Check if the user has the provided password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    // Fetch roles of the user for all projects
    const userRoles = await UserRole.findAll({ where: { UserId: user.id } });
    // Generate JWT token with user roles
    const token = jwt.sign({ user: {id: user.id, name:user.name}, roles: userRoles.map(role => ({ projectId: role.ProjectId, role: role.role })) }, 'secret_key', { expiresIn: '1h' });
    res.json({ token }); // Send user roles along with the token
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});
// Change password
router.put('/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Check if the current password is correct
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid current password' });
    }
    // Hash and update the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedNewPassword });
    // Fetch the email template and send the email
    const templateId = 3; // Assumes the template ID for forgot password is 2
    const placeholders = {
      name: user.name
    };
    await sendEmailWithTemplate(templateId, user.email, placeholders);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});
// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const generateRandomPassword = () => {
      const length = 8;
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let password = '';
      for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
      }
      return password;
    };
    const newPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });
    // Fetch the email template and send the email
    const templateId = 5; // Assumes the template ID for forgot password is 2
    const placeholders = {
      name: user.name,
      newPassword: newPassword
    };
    await sendEmailWithTemplate(templateId, user.email, placeholders);
    res.json({ message: 'New password has been sent to your email.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});
// User logout (if needed)
router.post('/logout', (req, res) => {
  // Implement logout logic here if necessary
});
// Fetch user info
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});
module.exports = router;
