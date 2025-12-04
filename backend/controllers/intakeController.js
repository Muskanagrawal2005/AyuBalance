const IntakeLog = require('../models/IntakeLog');
const FoodItem = require('../models/FoodItem');

// @desc    Log a meal item
// @route   POST /api/patient/intake
exports.logIntake = async (req, res) => {
  try {
    const { date, mealType, foodId, quantity, unit } = req.body;
    
    // 1. Get Food Details (to calculate calories)
    const food = await FoodItem.findById(foodId);
    if (!food) return res.status(404).json({ message: 'Food not found' });

    const calories = food.calories * quantity; 

    // 2. Normalize Date (Strip time)
    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    // 3. Find Log for this day OR Create new one
    let log = await IntakeLog.findOne({ 
      patient: req.user._id, 
      date: logDate 
    });

    if (!log) {
      log = new IntakeLog({
        patient: req.user._id,
        date: logDate,
        meals: { breakfast: [], lunch: [], dinner: [], snack: [] }
      });
    }

    // 4. Push item to the correct meal array
    log.meals[mealType].push({
      foodItem: foodId,
      quantity,
      unit,
      calories
    });

    // 5. Update Total Calories
    log.totalCalories += calories;

    await log.save();
    res.status(200).json(log);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logs for a specific date
// @route   GET /api/patient/intake
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

// @desc    (Dietitian) Get logs for a specific patient & date
// @route   GET /api/dietitian/patients/:patientId/logs?date=...
exports.getPatientLogForDietitian = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { date } = req.query;

    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const log = await IntakeLog.findOne({ 
      patient: patientId, // Search by the URL param, not logged-in user
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