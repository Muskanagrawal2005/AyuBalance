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


// @desc    Delete a diet plan
// @route   DELETE /api/dietitian/diet-plans/:id
exports.deleteDietPlan = async (req, res) => {
  try {
    const plan = await DietPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }

    // Security: Ensure the dietitian deleting it is the one who created it
    if (plan.dietitian.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this plan' });
    }

    await plan.deleteOne(); // or await DietPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Diet plan removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};