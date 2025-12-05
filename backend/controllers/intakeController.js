const IntakeLog = require('../models/IntakeLog');
const FoodItem = require('../models/FoodItem');
const User = require('../models/User'); // <--- 1. THIS WAS MISSING!

// @desc    Log a meal item
// @route   POST /api/patient/intake
exports.logIntake = async (req, res) => {
  try {
    const { date, mealType, foodId, quantity, unit } = req.body;
    
    // 1. Get Food Details
    const food = await FoodItem.findById(foodId);
    if (!food) return res.status(404).json({ message: 'Food not found' });

    const calories = food.calories * quantity; 

    // 2. Normalize Date
    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    // 3. Find Log OR Create new one
    let log = await IntakeLog.findOne({ 
      patient: req.user._id, 
      date: logDate 
    });

    // 4. Fetch Patient Details (Needed for both new logs and fixing old logs)
    // We need to know who the dietitian is to save the log correctly
    const patientDetails = await User.findById(req.user._id);

    if (!log) {
      // CASE A: Create New Log
      log = new IntakeLog({
        patient: req.user._id,
        dietitian: patientDetails.createdByDietitian, // Auto-assign Dietitian
        date: logDate,
        meals: { breakfast: [], lunch: [], dinner: [], snack: [] }
      });
    } else {
      // CASE B: Fix Old Log (Migration Fix)
      // If an existing log doesn't have a dietitian set, backfill it now
      if (!log.dietitian) {
        log.dietitian = patientDetails.createdByDietitian;
      }
    }

    // 5. Push item
    log.meals[mealType].push({
      foodItem: foodId,
      quantity,
      unit,
      calories
    });

    // 6. Update Total Calories
    log.totalCalories += calories;

    await log.save();
    res.status(200).json(log);

  } catch (error) {
    console.error("Intake Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ... (Keep your getIntakeByDate and getPatientLogForDietitian functions exactly as they were)
exports.getIntakeByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const log = await IntakeLog.findOne({ 
      patient: req.user._id, 
      date: queryDate 
    }).populate('meals.breakfast.foodItem')
      .populate('meals.lunch.foodItem')
      .populate('meals.dinner.foodItem')
      .populate('meals.snack.foodItem');

    if (!log) {
      return res.json({ 
        date: queryDate, 
        meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
        totalCalories: 0 
      });
    }

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPatientLogForDietitian = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { date } = req.query;

    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const log = await IntakeLog.findOne({ 
      patient: patientId, 
      date: queryDate 
    }).populate('meals.breakfast.foodItem')
      .populate('meals.lunch.foodItem')
      .populate('meals.dinner.foodItem')
      .populate('meals.snack.foodItem');

    if (!log) {
      return res.json({ 
        date: queryDate, 
        meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
        totalCalories: 0 
      });
    }

    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};