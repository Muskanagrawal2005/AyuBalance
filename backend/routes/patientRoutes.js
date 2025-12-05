const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { getMyPlans } = require('../controllers/patientController');
const { logIntake, getIntakeByDate } = require('../controllers/intakeController');
const { getMyAnalysis } = require('../controllers/analysisController');

// Import Appointment Controller
const { 
  createOrder, 
  verifyPaymentAndBook, 
  getPatientAppointments 
} = require('../controllers/appointmentController');

router.use(protect);
router.use(restrictTo('patient'));

router.get('/my-plans', getMyPlans);
router.get('/analysis', getMyAnalysis);

router.route('/intake')
  .post(logIntake)
  .get(getIntakeByDate);

// --- NEW APPOINTMENT ROUTES ---
router.post('/appointments/order', createOrder);       // Step 1: Get Order ID
router.post('/appointments/verify', verifyPaymentAndBook); // Step 2: Verify & Save
router.get('/appointments', getPatientAppointments);   // List My Bookings

module.exports = router;