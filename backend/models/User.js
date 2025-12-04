const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['dietitian', 'patient'], required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  createdByDietitian: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mobile: { type: String },
  age: { type: Number },
  gender: { type: String },
  allergies: [{ type: String }],
  ayurvedicDosha: { type: String },
  nextAppointment: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Encrypt password before saving
UserSchema.pre('save', async function () {
    // 1. If password is not modified, simply return (exits the function)
    if (!this.isModified('passwordHash')) return;
  
    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    
    // No need to call next() in async functions anymore!
  });
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// CRITICAL LINE BELOW
module.exports = mongoose.model('User', UserSchema);