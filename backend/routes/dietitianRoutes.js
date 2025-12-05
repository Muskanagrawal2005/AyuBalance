const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Import User Controllers
const { 
  createPatient, 
  getMyPatients, 
  getPatientById,
  updatePatient,
  deletePatient
} = require('../controllers/userController');

// Import Diet Plan Controllers
const { 
  createDietPlan, 
  getPatientDietPlans,
  deleteDietPlan // <--- Make sure this is imported
} = require('../controllers/dietPlanController');

// Import Analysis Controller
const { getPatientAnalysis } = require('../controllers/analysisController');

// Import Intake Controller
const { getPatientLogForDietitian } = require('../controllers/intakeController');

// Import Appointment Controller
const { getDietitianAppointments } = require('../controllers/appointmentController');


// --- APPLY SECURITY ---
// All routes below this line are protected and restricted to 'dietitian'
router.use(protect); 
router.use(restrictTo('dietitian'));


// --- PATIENT ROUTES ---
router.route('/patients')
  .post(createPatient)
  .get(getMyPatients);

router.route('/patients/:id')
  .get(getPatientById)
  .put(updatePatient)
  .delete(deletePatient);

// --- DIET PLAN ROUTES ---
router.route('/patients/:patientId/diet-plans')
  .post(createDietPlan)
  .get(getPatientDietPlans);

// 👇 THIS IS THE MISSING ROUTE CAUSING THE 404
router.delete('/diet-plans/:id', deleteDietPlan);


// --- OTHER FEATURES ---
router.get('/patients/:id/analysis', getPatientAnalysis);
router.get('/patients/:patientId/logs', getPatientLogForDietitian);
router.get('/appointments', getDietitianAppointments);

module.exports = router;