const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  servingSize: { type: String, default: "100g" }, 
  
  // Modern Nutritional Values (per serving)
  calories: { type: Number, required: true },
  protein_g: { type: Number, default: 0 },
  carbs_g: { type: Number, default: 0 },
  fat_g: { type: Number, default: 0 },
  fiber_g: { type: Number, default: 0 },
  
  // Ayurvedic Properties
  rasa: { type: String },   // Taste (Sweet, Sour, etc.)
  virya: { type: String },  // Potency (Hot/Cold)
  vipaka: { type: String }, // Post-digestive effect
  guna: { type: String },   // Qualities (Heavy, Light, Oily, etc.)
  
  // Dosha Effect (e.g., Pacifies Vata, Aggravates Pitta)
  doshaEffect: {
    vata: { type: String, enum: ['pacifies', 'aggravates', 'neutral'], default: 'neutral' },
    pitta: { type: String, enum: ['pacifies', 'aggravates', 'neutral'], default: 'neutral' },
    kapha: { type: String, enum: ['pacifies', 'aggravates', 'neutral'], default: 'neutral' }
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FoodItem', FoodItemSchema);