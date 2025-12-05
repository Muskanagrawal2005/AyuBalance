const express = require('express');
const router = express.Router();
const { registerDietitian, login, verifyEmail } = require('../controllers/authController');

// Route: POST /api/auth/register
router.post('/register', registerDietitian);
router.post('/login', login);
router.post('/verify-email', verifyEmail);

module.exports = router;