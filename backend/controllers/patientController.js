const DietPlan = require('../models/DietPlan');

// @desc    Get logged-in patient's diet plans
// @route   GET /api/patient/my-plans
// @access  Private (Patient)
exports.getMyPlans = async (req, res) => {
  try {
    // Find plans where the 'patient' field matches the logged-in user's ID
    const plans = await DietPlan.find({ patient: req.user._id })
      .populate('meals.items.foodItem') // Fill in food details
      .sort({ createdAt: -1 });
      
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};