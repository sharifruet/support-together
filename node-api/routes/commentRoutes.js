const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');


// Create a new comment
router.post('/comments', async (req, res) => {
  try {
    const { ticketId, content } = req.body;
    const createdBy = req.user.id; // Get the user ID from the authenticated user

    const comment = await Comment.create({ ticketId, createdBy, content });
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Get comments for a ticket
router.get('/tickets/:ticketId/comments', async (req, res) => {
  const { ticketId } = req.params;
  try {
    const comments = await Comment.findAll({ where: { ticketId } });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Edit a comment
router.put('/comments/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (comment.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to edit this comment' });
    }
    await comment.update({ content });
    res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete a comment
router.delete('/comments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (comment.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this comment' });
    }
    await comment.destroy();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
