const DietPlan = require('../models/DietPlan');
const User = require('../models/User');

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

exports.getMyProfile = async (req, res) => {
  try {
    const patient = await User.findById(req.user._id)
      .populate('createdByDietitian', 'name email mobile') // <--- This gets the Doctor's name
      .select('-passwordHash');

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};