// routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Attachment = require('../models/Attachment');
const FYITo = require('../models/FYITo');
const { sendEmail } = require('../services/emailService');
const authenticate = require('../middleware/authMiddleware');

// Function to send ticket created email
const sendTicketCreatedEmail = async (ticket) => {
  try {
    const ticketCreatorEmail = "sharifruet@gmail.com";

    await sendEmail(ticketCreatorEmail, 'Ticket Created Successfully', `Dear ${ticketCreatorEmail},\n\nYour ticket has been successfully created.\n\nTicket Details:\nTitle: ${ticket.title}\nDescription: ${ticket.description}\nPriority: ${ticket.priority}\n\nThank you.`);
  } catch (error) {
    console.error('Error sending ticket created email:', error);
  }
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

module.exports = router;
