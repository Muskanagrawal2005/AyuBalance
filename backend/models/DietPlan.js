const mongoose = require('mongoose');

const DietPlanSchema = new mongoose.Schema({
  dietitian: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'Weekly Plan' },
  
  // The Core Structure
  meals: [{
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
    items: [{
      foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }, // Link to Food DB
      quantity: { type: Number, default: 1 },
      unit: { type: String, default: 'serving' },
      notes: String
    }]
  }],
  
  instructions: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DietPlan', DietPlanSchema);