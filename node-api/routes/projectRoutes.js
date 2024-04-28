// routes/projectRoutes.js

const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Organization = require('../models/Organization');

// Create project
router.post('/projects', async (req, res) => {
  try {
    const { organizationId, code, name, description } = req.body;
    // Check if the organization exists
    const organization = await Organization.findByPk(organizationId);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    // Check if the project code already exists within the organization
    const existingProject = await Project.findOne({
      where: { code, OrganizationId: organizationId }
    });
    if (existingProject) {
      return res.status(400).json({ error: 'Project code must be unique within an organization' });
    }
    const project = await Project.create({ code, name, description, OrganizationId: organizationId });
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get all projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get project by ID
router.get('/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Update project
router.put('/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { code, name, description } = req.body;
  try {
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    // Check if the new code already exists within the organization
    if (code && code !== project.code) {
      const existingProject = await Project.findOne({
        where: { code, OrganizationId: project.OrganizationId }
      });
      if (existingProject) {
        return res.status(400).json({ error: 'Project code must be unique within an organization' });
      }
    }
    await project.update({ code, name, description });
    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await project.destroy();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
