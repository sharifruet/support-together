const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Attachment = require('../models/Attachment');
const FYITo = require('../models/FYITo');
const Topic = require('../models/Topic');
const Project = require('../models/Project');
const { sendEmailWithTemplate } = require('../services/emailService');
const authenticate = require('../middleware/authMiddleware');

// Function to send ticket created email
const sendTicketCreatedEmail = async (ticket) => {
  const placeholders = { title: ticket.title, code: ticket.code };
  const templateId = 1; // Assuming 1 is the template ID for the ticket created email
  await sendEmailWithTemplate(templateId, ticket.requestedBy, placeholders);
};

// Create or update attachments for a ticket
const createOrUpdateAttachments = async (ticketId, attachments) => {
  if (attachments && attachments.length > 0) {
    await Attachment.destroy({ where: { TicketId: ticketId } });
    await Attachment.bulkCreate(attachments.map(fileName => ({ fileName, TicketId: ticketId })));
  }
};

// Create or update FYI To recipients for a ticket
const createOrUpdateFYIToRecipients = async (ticketId, fyiTo) => {
  if (fyiTo && fyiTo.length > 0) {
    await FYITo.destroy({ where: { TicketId: ticketId } });
    await FYITo.bulkCreate(fyiTo.map(name => ({ name, TicketId: ticketId })));
  }
};

// Get all tickets
router.get('/tickets', authenticate, async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get a single ticket by ID
router.get('/tickets/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// Create ticket
router.post('/tickets', authenticate, async (req, res) => {
  try {
    const { topicId, title, description, priority, attachments, fyiTo } = req.body;
    const createdBy = req.user.id; // Get user ID from req.user

    const ticket = await Ticket.create({ topicId, title, description, priority, createdBy });

    // Create attachments
    await createOrUpdateAttachments(ticket.id, attachments);

    // Create FYI To recipients
    await createOrUpdateFYIToRecipients(ticket.id, fyiTo);

    // Send ticket created email
    await sendTicketCreatedEmail(ticket);

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Update ticket
router.put('/tickets/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, attachments, fyiTo } = req.body;
  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    await ticket.update({ title, description, priority });

    // Update attachments
    await createOrUpdateAttachments(id, attachments);

    // Update FYI To recipients
    await createOrUpdateFYIToRecipients(id, fyiTo);

    res.json({ message: 'Ticket updated successfully' });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// Delete ticket
router.delete('/tickets/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Delete attachments and FYI To recipients associated with the ticket
    await Attachment.destroy({ where: { TicketId: ticket.id } });
    await FYITo.destroy({ where: { TicketId: ticket.id } });

    await ticket.destroy();
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

// Fetch tickets by project ID
router.get('/tickets/project/:projectId', authenticate, async (req, res) => {
  try {
    const { projectId } = req.params;
    const topics = await Topic.findAll({projectId: projectId});

    if (!topics || topics.length < 1) {
      return res.status(404).json({ error: 'Project / topic not found' });
    }

    const topicIds = topics.map(topic => topic.id);
    
    const tickets = await Ticket.findAll({
      where: {
        id: topicIds
      }
    });
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets by project:', error);
    res.status(500).json({ error: 'Failed to fetch tickets by project' });
  }
});

module.exports = router;
