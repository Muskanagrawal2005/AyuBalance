const DietPlan = require('../models/DietPlan');

// @desc    Create a new Diet Plan
// @route   POST /api/dietitian/patients/:patientId/diet-plans
exports.createDietPlan = async (req, res) => {
  try {
    const { meals, instructions, name } = req.body;
    const { patientId } = req.params;

    const plan = await DietPlan.create({
      dietitian: req.user._id,
      patient: patientId,
      name,
      meals,
      instructions
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all plans for a specific patient
// @route   GET /api/dietitian/patients/:patientId/diet-plans
exports.getPatientDietPlans = async (req, res) => {
  try {
    const plans = await DietPlan.find({ patient: req.params.patientId })
      .populate('meals.items.foodItem') // <--- MAGIC: Fills in the food details (name, calories)
      .sort({ createdAt: -1 });
      
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
