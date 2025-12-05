const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  dietitian: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  date: { type: Date, required: true },
  slotTime: { type: String, required: true },
  
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
    default: 'pending' 
  },
  
  payment: {
    amount: { type: Number, required: true },
    razorpayOrderId: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' }
  },
  
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

// 👇 THIS LINE IS CRITICAL. IF MISSING, YOU GET THE ERROR.
module.exports = mongoose.model('Appointment', AppointmentSchema);