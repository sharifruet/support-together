// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findByPk(decoded.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    req.user = user; // Store user information in req.user
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = authenticate;
