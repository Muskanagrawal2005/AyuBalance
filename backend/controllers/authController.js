const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// --- HELPER FUNCTIONS ---

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

// --- CONTROLLERS ---

// @desc    Register a new Dietitian
// @route   POST /api/auth/register
exports.registerDietitian = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create User
    const user = await User.create({
      name,
      email,
      passwordHash: password, // Ensure your User model handles hashing in pre-save
      role: 'dietitian',
      isVerified: false,
      verificationToken
    });

    // Send Email
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
        message: 'Registration successful! Please check your email.'
      });
    } catch (error) {
      await user.deleteOne(); 
      return res.status(500).json({ message: 'Email could not be sent. Registration failed.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user & include password for checking
    const user = await User.findOne({ email }).select('+passwordHash');

    if (user && (await user.matchPassword(password))) {
      
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email first.' });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user._id);

      // Send Refresh Token in HTTP-Only Cookie
      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
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

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Auto-login
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.json({
        success: true,
        accessToken,
        message: "Email verified successfully!"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change Password (REQUIRED for Patient Flow)
// @route   POST /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Get user (ID comes from auth middleware)
    const user = await User.findById(req.user.id).select('+passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check old password
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Update password (Model pre-save hook handles hashing)
    user.passwordHash = newPassword; 
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Logout User
// @route   POST /api/auth/logout
exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ message: 'Logged out successfully' });
};