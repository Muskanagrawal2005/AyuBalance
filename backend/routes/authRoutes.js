const express = require('express');
const router = express.Router();

// 1. FIX: Add 'changePassword' to this list
const { 
  registerDietitian, 
  login, 
  verifyEmail, 
  changePassword 
} = require('../controllers/authController');

// 2. CHECK PATH: Ensure your folder is named 'middlewares' or 'middleware'
const { protect } = require('../middlewares/authMiddleware'); 

// Route: POST /api/auth/register
router.post('/register', registerDietitian);
router.post('/login', login);
router.post('/verify-email', verifyEmail);

// This line was crashing because changePassword wasn't imported above
router.post('/change-password', protect, changePassword);

module.exports = router;