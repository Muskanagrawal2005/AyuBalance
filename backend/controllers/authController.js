const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto'); // Built-in Node module

// 1. UPDATED: Accept the whole user object to include name/email in token
// <--- CHANGED THIS FUNCTION
const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role, 
      name: user.name, 
      email: user.email 
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new Dietitian
exports.registerDietitian = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 1. Generate a random verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 2. Create User (isVerified: FALSE)
    const user = await User.create({
      name,
      email,
      passwordHash: password,
      role: 'dietitian',
      isVerified: false, // <--- CHANGED
      verificationToken  // <--- Save the token
    });

    // 3. Create Verification Link
    const verifyUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;

    const message = `
      <h1>Welcome to AyurCare!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verifyUrl}" clicktracking=off>${verifyUrl}</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'AyurCare Email Verification',
        html: message
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful! Please check your email to verify account.'
      });
    } catch (error) {
      // If email fails, delete the user so they can try again
      await user.deleteOne(); 
      res.status(500).json({ message: 'Email could not be sent. Registration failed.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Login user & get token
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (user && (await user.matchPassword(password))) {
        
        // 3. UPDATED: Pass the whole user object
        // <--- CHANGED HERE
        if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email first.' });
      }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user._id);
  
        res.cookie('jwt', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 
        });
  
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // @desc    Verify User Email
// @route   POST /api/auth/verify-email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    // Find user with this token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Verify User
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the token
    await user.save();

    // Generate Tokens (Auto-login after verify)
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        message: "Email verified successfully!"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};