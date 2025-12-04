const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

    const user = await User.create({
      name,
      email,
      passwordHash: password,
      role: 'dietitian',
      isVerified: true 
    });

    if (user) {
      // 2. UPDATED: Pass the whole user object
      // <--- CHANGED HERE
      const accessToken = generateAccessToken(user); 
      const refreshToken = generateRefreshToken(user._id);

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken 
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
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