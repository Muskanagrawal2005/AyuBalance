const FoodItem = require('../models/FoodItem');

// @desc    Add a new food item to the database
// @route   POST /api/food
// @access  Private (Dietitian)
exports.createFoodItem = async (req, res) => {
  try {
    const food = await FoodItem.create(req.body);
    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Search food items
// @route   GET /api/food?search=apple
// @access  Private (Dietitian & Patient)
exports.getFoodItems = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: 'i', // Case insensitive
          },
        }
      : {};

    const foods = await FoodItem.find({ ...keyword }).limit(20); // Limit to 20 results
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};