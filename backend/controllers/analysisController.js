const User = require('../models/User');
const IntakeLog = require('../models/IntakeLog');
const DietPlan = require('../models/DietPlan'); 

// --- HELPER FUNCTION: Core Calculation Logic ---
// This ensures both Dietitian and Patient see the EXACT same math.
const calculateAnalysis = async (patientId, startDate, endDate) => {
  
  // 1. CALCULATE TARGETS (Goal) from Latest Diet Plan
  // -------------------------------------------------
  let dailyTarget = { calories: 2000, protein: 50, carbs: 250, fat: 70 }; // Default Fallback
  let planName = "Default RDA";

  const activePlan = await DietPlan.findOne({ patient: patientId })
    .sort({ createdAt: -1 }) // Get latest
    .populate('meals.items.foodItem');

  if (activePlan) {
    planName = activePlan.name;
    let planCal = 0, planPro = 0, planCarb = 0, planFat = 0;

    activePlan.meals.forEach(meal => {
      meal.items.forEach(item => {
        if (item.foodItem) {
          const qty = item.quantity || 1;
          planCal += (item.foodItem.calories || 0) * qty;
          planPro += (item.foodItem.protein_g || 0) * qty;
          planCarb += (item.foodItem.carbs_g || 0) * qty;
          planFat += (item.foodItem.fat_g || 0) * qty;
        }
      });
    });

    // Update targets to match the Plan
    dailyTarget = {
      calories: Math.round(planCal),
      protein: Math.round(planPro),
      carbs: Math.round(planCarb),
      fat: Math.round(planFat)
    };
  }

  // 2. CALCULATE ACTUALS from Intake Logs
  // -------------------------------------------------
  const logs = await IntakeLog.find({
    patient: patientId,
    date: { $gte: startDate, $lte: endDate }
  }).populate('meals.breakfast.foodItem')
    .populate('meals.lunch.foodItem')
    .populate('meals.dinner.foodItem')
    .populate('meals.snack.foodItem');

  let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;
  let doshaCounts = { Vata: 0, Pitta: 0, Kapha: 0, Neutral: 0 };

  logs.forEach(log => {
    ['breakfast', 'lunch', 'dinner', 'snack'].forEach(mealType => {
      log.meals[mealType].forEach(item => {
        if (item.foodItem) {
          const qty = item.quantity || 1;
          totalCalories += (item.foodItem.calories || 0) * qty;
          totalProtein += (item.foodItem.protein_g || 0) * qty;
          totalCarbs += (item.foodItem.carbs_g || 0) * qty;
          totalFat += (item.foodItem.fat_g || 0) * qty;

          const effects = item.foodItem.doshaEffect;
          if (effects) {
            if (effects.vata === 'aggravates') doshaCounts.Vata++;
            if (effects.pitta === 'aggravates') doshaCounts.Pitta++;
            if (effects.kapha === 'aggravates') doshaCounts.Kapha++;
          }
        }
      });
    });
  });

  // Calculate Daily Averages for the selected range
  const daysDiff = Math.max(1, (endDate - startDate) / (1000 * 60 * 60 * 24));

  return {
    daysLogged: logs.length,
    totals: {
      calories: Math.round(totalCalories / daysDiff),
      protein: Math.round(totalProtein / daysDiff),
      carbs: Math.round(totalCarbs / daysDiff),
      fat: Math.round(totalFat / daysDiff)
    },
    targets: dailyTarget,
    planName: planName,
    doshaAnalysis: doshaCounts
  };
};

// --- EXPORTED CONTROLLERS ---

// @desc    (Dietitian) Get aggregated data
// @route   GET /api/dietitian/patients/:id/analysis
exports.getPatientAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to } = req.query;
    
    const startDate = new Date(from);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);

    const data = await calculateAnalysis(id, startDate, endDate);
    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    (Patient) Get my own analysis
// @route   GET /api/patient/analysis
exports.getMyAnalysis = async (req, res) => {
  try {
    const id = req.user._id; // Use logged-in user ID
    const { from, to } = req.query;

    const startDate = new Date(from);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);

    const data = await calculateAnalysis(id, startDate, endDate);
    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};