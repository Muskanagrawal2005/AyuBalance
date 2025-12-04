const express = require('express');
const router = express.Router();
const { registerDietitian, login } = require('../controllers/authController');

// Route: POST /api/auth/register
router.post('/register', registerDietitian);
router.post('/login', login);

module.exports = router;