// routes/topicRoutes.js

const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const Project = require('../models/Project');

// Create topic
router.post('/topics', async (req, res) => {
  try {
    const { projectId, name, description, supportTeamId } = req.body;
    // Check if the project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const topic = await Topic.create({ name, description, ProjectId: projectId, supportTeamId: supportTeamId });
    res.status(201).json(topic);
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

// Get all topics
router.get('/topics', async (req, res) => {
  try {
    const topics = await Topic.findAll();
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// Get topic by ID
router.get('/topics/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const topic = await Topic.findByPk(id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ error: 'Failed to fetch topic' });
  }
});

// Update topic
router.put('/topics/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, supportTeamId } = req.body;
  try {
    const topic = await Topic.findByPk(id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    await topic.update({ name, description, supportTeamId });
    res.json({ message: 'Topic updated successfully' });
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ error: 'Failed to update topic' });
  }
});

// Delete topic
router.delete('/topics/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const topic = await Topic.findByPk(id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    await topic.destroy();
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

module.exports = router;
