// routes/ticketRoutes.js

const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Topic = require('../models/Topic');

// Create ticket
router.post('/tickets', async (req, res) => {
  try {
    const { topicId, title, description, priority, requestedBy, fyiTo } = req.body;
    // Check if the topic exists
    const topic = await Topic.findByPk(topicId);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    // Assign ticket based on topic's assigned team and escalation level
    const assignedTo = ''; // Implement logic to assign ticket based on team and escalation level
    const escalationLevel = ''; // Implement logic to determine escalation level based on priority
    const ticket = await Ticket.create({ title, description, priority, requestedBy, fyiTo, assignedTo, escalationLevel, TopicId: topicId });
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Get all tickets
router.get('/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get ticket by ID
router.get('/tickets/:id', async (req, res) => {
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

// Update ticket
router.put('/tickets/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, requestedBy, fyiTo } = req.body;
  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    await ticket.update({ title, description, priority, requestedBy, fyiTo });
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
    await ticket.destroy();
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

module.exports = router;
