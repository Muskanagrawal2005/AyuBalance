
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Allows us to accept JSON data in the body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Allows us to read cookies from the browser

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite default port
  credentials: true // Crucial for cookies/sessions
}));

// Simple Health Check Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes (We will add these in the next step)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dietitian', require('./routes/dietitianRoutes'));
app.use('/api/food', require('./routes/foodRoutes'));

app.use('/api/patient', require('./routes/patientRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));