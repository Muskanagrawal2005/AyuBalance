const mongoose = require('mongoose');

const IntakeLogSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dietitian: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true }, // e.g., 2025-01-20
  
  // We group logs by meal type
  meals: {
    breakfast: [{
      foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
      quantity: Number, // e.g. 1
      unit: String,     // e.g. "serving"
      calories: Number  // Cached value for easier math later
    }],
    lunch: [{
      foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
      quantity: Number,
      unit: String,
      calories: Number
    }],
    dinner: [{
      foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
      quantity: Number,
      unit: String,
      calories: Number
    }],
    snack: [{
      foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
      quantity: Number,
      unit: String,
      calories: Number
    }]
  },
  
  totalCalories: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Compound index to ensure 1 log per patient per day
IntakeLogSchema.index({ patient: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('IntakeLog', IntakeLogSchema);