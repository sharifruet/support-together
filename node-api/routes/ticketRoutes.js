// routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Attachment = require('../models/Attachment');
const FYITo = require('../models/FYITo');

// Create ticket
router.post('/tickets', async (req, res) => {
  try {
    const { topicId, title, description, priority, requestedBy, attachments, fyiTo } = req.body;

    const ticket = await Ticket.create({ topicId, title, description, priority, requestedBy });

    // Create attachments
    if (attachments && attachments.length > 0) {
      await Promise.all(attachments.map(async (fileName) => {
        await Attachment.create({ fileName, TicketId: ticket.id });
      }));
    }

    // Create FYI To recipients
    if (fyiTo && fyiTo.length > 0) {
      await Promise.all(fyiTo.map(async (name) => {
        await FYITo.create({ name, TicketId: ticket.id });
      }));
    }

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Update ticket
router.put('/tickets/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, requestedBy, attachments, fyiTo } = req.body;
  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    await ticket.update({ title, description, priority, requestedBy });

    // Update attachments
    if (attachments && attachments.length > 0) {
      await Attachment.destroy({ where: { TicketId: ticket.id } });
      await Promise.all(attachments.map(async (fileName) => {
        await Attachment.create({ fileName, TicketId: ticket.id });
      }));
    }

    // Update FYI To recipients
    if (fyiTo && fyiTo.length > 0) {
      await FYITo.destroy({ where: { TicketId: ticket.id } });
      await Promise.all(fyiTo.map(async (name) => {
        await FYITo.create({ name, TicketId: ticket.id });
      }));
    }

    res.json({ message: 'Ticket updated successfully' });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// Delete ticket
router.delete('/tickets/:id', async (req, res) => {
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
