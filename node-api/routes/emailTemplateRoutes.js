// routes/emailTemplateRoutes.js
const express = require('express');
const router = express.Router();
const EmailTemplate = require('../models/EmailTemplate');

// Create a new email template
router.post('/email-templates', async (req, res) => {
  try {
    const { name, subject, body } = req.body;
    const emailTemplate = await EmailTemplate.create({ name, subject, body });
    res.status(201).json(emailTemplate);
  } catch (error) {
    console.error('Error creating email template:', error);
    res.status(500).json({ error: 'Failed to create email template' });
  }
});

// Get all email templates
router.get('/email-templates', async (req, res) => {
  try {
    const emailTemplates = await EmailTemplate.findAll();
    res.status(200).json(emailTemplates);
  } catch (error) {
    console.error('Error fetching email templates:', error);
    res.status(500).json({ error: 'Failed to fetch email templates' });
  }
});

// Get a single email template by ID
router.get('/email-templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const emailTemplate = await EmailTemplate.findByPk(id);
    if (!emailTemplate) {
      return res.status(404).json({ error: 'Email template not found' });
    }
    res.status(200).json(emailTemplate);
  } catch (error) {
    console.error('Error fetching email template:', error);
    res.status(500).json({ error: 'Failed to fetch email template' });
  }
});

// Update an email template
router.put('/email-templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, body } = req.body;
    const emailTemplate = await EmailTemplate.findByPk(id);
    if (!emailTemplate) {
      return res.status(404).json({ error: 'Email template not found' });
    }
    await emailTemplate.update({ name, subject, body });
    res.status(200).json(emailTemplate);
  } catch (error) {
    console.error('Error updating email template:', error);
    res.status(500).json({ error: 'Failed to update email template' });
  }
});

// Delete an email template
router.delete('/email-templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const emailTemplate = await EmailTemplate.findByPk(id);
    if (!emailTemplate) {
      return res.status(404).json({ error: 'Email template not found' });
    }
    await emailTemplate.destroy();
    res.status(200).json({ message: 'Email template deleted successfully' });
  } catch (error) {
    console.error('Error deleting email template:', error);
    res.status(500).json({ error: 'Failed to delete email template' });
  }
});

module.exports = router;
