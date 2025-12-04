const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { createFoodItem, getFoodItems } = require('../controllers/foodController');

// Search is available to any logged in user (Dietitian or Patient)
router.get('/', protect, getFoodItems);

// Creating food is restricted to Dietitians only
router.post('/', protect, restrictTo('dietitian'), createFoodItem);

module.exports = router;