const IntakeLog = require('../models/IntakeLog');

// @desc    Get aggregated nutrient data for a date range
// @route   GET /api/dietitian/patients/:id/analysis?from=...&to=...
exports.getPatientAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to } = req.query; // e.g. 2025-01-01

    const startDate = new Date(from);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999); // Include the full end day

    // 1. Fetch all logs in range
    const logs = await IntakeLog.find({
      patient: id,
      date: { $gte: startDate, $lte: endDate }
    }).populate('meals.breakfast.foodItem')
      .populate('meals.lunch.foodItem')
      .populate('meals.dinner.foodItem')
      .populate('meals.snack.foodItem');

    // 2. Aggregate Data
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    
    // Ayurvedic Counters
    let doshaCounts = { Vata: 0, Pitta: 0, Kapha: 0, Neutral: 0 };

    logs.forEach(log => {
      // Loop through all 4 meal types
      ['breakfast', 'lunch', 'dinner', 'snack'].forEach(mealType => {
        log.meals[mealType].forEach(item => {
          if (item.foodItem) {
            const qty = item.quantity || 1;
            
            totalCalories += (item.foodItem.calories || 0) * qty;
            totalProtein += (item.foodItem.protein_g || 0) * qty;
            totalCarbs += (item.foodItem.carbs_g || 0) * qty;
            totalFat += (item.foodItem.fat_g || 0) * qty;

            // Simple logic: If a food 'aggravates' a dosha, count it
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

    res.json({
      daysLogged: logs.length,
      totals: {
        calories: Math.round(totalCalories),
        protein: Math.round(totalProtein),
        carbs: Math.round(totalCarbs),
        fat: Math.round(totalFat)
      },
      doshaAnalysis: doshaCounts
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in patient's own analysis
// @route   GET /api/patient/analysis
exports.getMyAnalysis = async (req, res) => {
  try {
    // 1. Use the logged-in user's ID
    const id = req.user._id; 
    const { from, to } = req.query;

    const startDate = new Date(from);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);

    // 2. Fetch logs (Exact same logic as before)
    const logs = await IntakeLog.find({
      patient: id,
      date: { $gte: startDate, $lte: endDate }
    }).populate('meals.breakfast.foodItem')
      .populate('meals.lunch.foodItem')
      .populate('meals.dinner.foodItem')
      .populate('meals.snack.foodItem');

    // 3. Aggregate (Copy exact same logic)
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

    res.json({
      daysLogged: logs.length,
      totals: {
        calories: Math.round(totalCalories),
        protein: Math.round(totalProtein),
        carbs: Math.round(totalCarbs),
        fat: Math.round(totalFat)
      },
      doshaAnalysis: doshaCounts
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};