// routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const { sendEmailWithTemplate } = require('../services/emailService');

// Route to send an email using a template
router.post('/send-email', async (req, res) => {
  try {
    const { templateId, recipient, placeholders } = req.body;
    await sendEmailWithTemplate(templateId, recipient, placeholders);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
