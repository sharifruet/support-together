const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Attachment = require('../models/Attachment');
const FYITo = require('../models/FYITo');
const Topic = require('../models/Topic');
const UserRole = require('../models/UserRole');
const Project = require('../models/Project');
const { sendEmailWithTemplate } = require('../services/emailService');
const { requireCustomerOrSupport, requireSupport, requireAdminOrSupport } = require('../middleware/roleMiddleware');

// Generate a human‑readable ticket code based on project code and ticket count
const generateTicketCode = async (ticket) => {
  // Load the topic (with its project) for this ticket
  const topic = await Topic.findByPk(ticket.topicId, { include: Project });
  if (!topic || !topic.Project) {
    return null;
  }

  const projectCode = topic.Project.code;

  // Count existing tickets for all topics under the same project
  const projectTopics = await Topic.findAll({
    where: { ProjectId: topic.ProjectId },
    attributes: ['id'],
  });
  const topicIds = projectTopics.map((t) => t.id);

  const ticketCount = await Ticket.count({
    where: { topicId: topicIds },
  });

  // Next sequential number for this project
  const nextNumber = ticketCount + 1;
  return `${projectCode}-${nextNumber}`;
};

// Function to send ticket created email
const sendTicketCreatedEmail = async (ticket, user) => {
  const placeholders = {
    title: ticket.title,
    code: ticket.code,
    createdAt: ticket.createdAt,
    email: user.email,
    name: user.name,
  };
  const templateId = 1; // Template ID for the ticket created email
  await sendEmailWithTemplate(templateId, user.email, placeholders);
};

// Create or update attachments for a ticket
const createOrUpdateAttachments = async (ticketId, attachments) => {
  if (attachments && attachments.length > 0) {
    await Attachment.destroy({ where: { ticketId: ticketId } });
    await Attachment.bulkCreate(attachments.map(fileName => ({ fileName, ticketId: ticketId })));
  }
};

// Create or update FYI To recipients for a ticket
const createOrUpdateFYIToRecipients = async (ticketId, fyiTo) => {
  if (fyiTo && fyiTo.length > 0) {
    await FYITo.destroy({ where: { ticketId: ticketId } });
    await FYITo.bulkCreate(fyiTo.map(name => ({ name, ticketId: ticketId })));
  }
};

// Get all tickets
router.get('/tickets', async (req, res) => {
  try {
    const userId = req.user.id;

    const userRoles = await UserRole.findAll({where:{userId:userId}});

    const projectIds = userRoles.map(ur=>ur.ProjectId);

    const topics = await Topic.findAll({where:{projectId:projectIds}});

    const topicIds = topics.map(topic=>topic.id);
   
    const tickets = await Ticket.findAll({where:{topicId:topicIds}});

    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get all tickets
router.get('/tickets/code/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const ticket = await Ticket.findOne({where:{code:code}});
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    const attachments = await Attachment.findAll({ where: { ticketId: ticket.id } });
    const ticketWithAttachments = {
      ...ticket.get({ plain: true }),
      attachments
    };

    //console.log(ticketWithAttachments);
    res.json(ticketWithAttachments);

  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get a single ticket by ID
router.get('/tickets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    const attachments = await Attachment.findAll({ where: { ticketId: ticket.id } });
    const ticketWithAttachments = {
      ...ticket.get({ plain: true }),
      attachments
    };
    res.json(ticketWithAttachments);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// Create ticket
router.post('/tickets', requireCustomerOrSupport(), async (req, res) => {
  try {

    const { topicId, title, description, priority, attachments, fyiTo } = req.body;
    const createdBy = req.user.id; // Get user ID from req.user
    const user = req.user;

    // Create the ticket first
    let ticket = await Ticket.create({ topicId, title, description, priority, createdBy });

    // Generate and persist a ticket code (replaces missing DB trigger)
    const code = await generateTicketCode(ticket);
    if (code) {
      await ticket.update({ code });
    }
    // Create attachments
    await createOrUpdateAttachments(ticket.id, attachments);
    // Create FYI To recipients
    await createOrUpdateFYIToRecipients(ticket.id, fyiTo);
    // Reload ticket to ensure latest values (including code / timestamps)
    ticket = await Ticket.findByPk(ticket.id);

    // Send ticket created email
    await sendTicketCreatedEmail(ticket, user);

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Update ticket
router.put('/tickets/:id', requireSupport(), async (req, res) => {
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

// Update ticket status
router.put('/tickets/:id/status/:status', requireSupport(), async (req, res) => {
  const { id, status } = req.params;
  
  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    await ticket.update({ status });

    res.json({ message: 'Ticket updated successfully' });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// Acknowledge ticket
router.put('/tickets/:id/acknowledge', requireSupport(), async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check if ticket is assigned to the current user
    if (ticket.assignedTo !== userId) {
      return res.status(403).json({ error: 'You can only acknowledge tickets assigned to you' });
    }

    // Check if ticket is in an 'Assigned' state (not already acknowledged)
    if (!ticket.assignmentStatus || !ticket.assignmentStatus.startsWith('Assigned')) {
      return res.status(400).json({ error: 'Ticket is not in an assigned state' });
    }

    // Extract the escalation level from current assignmentStatus
    const levelMatch = ticket.assignmentStatus.match(/L(\d)/);
    const level = levelMatch ? levelMatch[1] : '1';
    
    // Update to acknowledged status
    const acknowledgedStatus = `Acknowledged (L${level})`;
    const now = new Date();
    
    await ticket.update({
      assignmentStatus: acknowledgedStatus,
      acknowledgedAt: now
    });

    console.log(`Ticket ${ticket.code || ticket.id} acknowledged by user ${req.user.name} at level L${level}`);

    res.json({ 
      message: 'Ticket acknowledged successfully',
      ticket: {
        id: ticket.id,
        code: ticket.code,
        assignmentStatus: acknowledgedStatus,
        acknowledgedAt: now
      }
    });
  } catch (error) {
    console.error('Error acknowledging ticket:', error);
    res.status(500).json({ error: 'Failed to acknowledge ticket' });
  }
});

// Delete ticket
router.delete('/tickets/:id', requireAdminOrSupport(), async (req, res) => {
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
router.get('/tickets/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const topics = await Topic.findAll({projectId: projectId});

    if (!topics || topics.length < 1) {
      return res.status(404).json({ error: 'Project / topic not found' });
    }

    const topicIds = topics.map(topic => topic.id);
    
    const tickets = await Ticket.findAll({
      where: {
        topicId: topicIds
      }
    });
    
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets by project:', error);
    res.status(500).json({ error: 'Failed to fetch tickets by project' });
  }
});

module.exports = router;
