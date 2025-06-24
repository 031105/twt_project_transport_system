const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

// GET /api/users/profile - Get user profile
router.get('/profile', async (req, res) => {
  res.json({
    message: 'User profile endpoint - coming soon',
    user: req.user
  });
});

// PUT /api/users/profile - Update user profile
router.put('/profile', async (req, res) => {
  res.json({
    message: 'Update user profile endpoint - coming soon'
  });
});

module.exports = router; 