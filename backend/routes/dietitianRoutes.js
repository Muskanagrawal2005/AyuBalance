const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { createPatient, getMyPatients, getPatientById } = require('../controllers/userController');
const { createDietPlan, getPatientDietPlans } = require('../controllers/dietPlanController');
const { getPatientLogForDietitian } = require('../controllers/intakeController');
const { getPatientAnalysis } = require('../controllers/analysisController');

// All routes here are protected and restricted to 'dietitian'
router.use(protect);
router.use(restrictTo('dietitian'));

router.route('/patients')
  .post(createPatient)
  .get(getMyPatients);

// NEW: Diet Plan Routes
router.route('/patients/:patientId/diet-plans')
  .post(createDietPlan)
  .get(getPatientDietPlans);

router.route('/patients/:id')
  .get(getPatientById);

router.get('/patients/:patientId/logs', getPatientLogForDietitian);
router.get('/patients/:id/analysis', getPatientAnalysis);


module.exports = router;