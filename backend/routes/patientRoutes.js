const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Import Controllers
const { getMyPlans } = require('../controllers/patientController');
// 👇 Ensure this path matches exactly where you created the file in Step 1
const { logIntake, getIntakeByDate } = require('../controllers/intakeController');
const { getMyAnalysis } = require('../controllers/analysisController');

// Middleware
router.use(protect);
router.use(restrictTo('patient'));

// Diet Plan Route
router.get('/my-plans', getMyPlans);

// Intake Routes
router.route('/intake')
  .post(logIntake)        // <--- This was likely undefined before
  .get(getIntakeByDate);  // <--- This too

router.get('/analysis', getMyAnalysis);

module.exports = router;