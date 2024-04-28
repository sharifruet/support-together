// routes/organizationRoutes.js

const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');

// Create organization
router.post('/organizations', async (req, res) => {
  try {
    const { code, name, address } = req.body;
    const existingOrganization = await Organization.findOne({ where: { code } });
    if (existingOrganization) {
      return res.status(400).json({ error: 'Organization code must be unique' });
    }
    const organization = await Organization.create({ code, name, address });
    res.status(201).json(organization);
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ error: 'Failed to create organization' });
  }
});

// Get all organizations
router.get('/organizations', async (req, res) => {
  try {
    const organizations = await Organization.findAll();
    res.json(organizations);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

// Get organization by ID
router.get('/organizations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const organization = await Organization.findByPk(id);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    res.json(organization);
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
});

// Update organization
router.put('/organizations/:id', async (req, res) => {
  const { id } = req.params;
  const { code, name, address } = req.body;
  try {
    const organization = await Organization.findByPk(id);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    // Check if the new code already exists
    if (code && code !== organization.code) {
      const existingOrganization = await Organization.findOne({ where: { code } });
      if (existingOrganization) {
        return res.status(400).json({ error: 'Organization code must be unique' });
      }
    }
    await organization.update({ code, name, address });
    res.json({ message: 'Organization updated successfully' });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ error: 'Failed to update organization' });
  }
});

// Delete organization
router.delete('/organizations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const organization = await Organization.findByPk(id);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    await organization.destroy();
    res.json({ message: 'Organization deleted successfully' });
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({ error: 'Failed to delete organization' });
  }
});

module.exports = router;
