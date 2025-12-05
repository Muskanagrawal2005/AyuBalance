const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Create a new Patient
// @route   POST /api/dietitian/patients
// @access  Private (Dietitian only)
exports.createPatient = async (req, res) => {
  try {
    const { name, email, mobile, age, gender, ayurvedicDosha } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Generate Password
    const tempPassword = Math.random().toString(36).slice(-8);

    // Create User
    const patient = await User.create({
      name,
      email,
      passwordHash: tempPassword,
      role: 'patient',
      createdByDietitian: req.user._id,
      isVerified: true,
      mobile,
      age,
      gender,
      ayurvedicDosha
    });

    // --- NEW: SEND EMAIL ---
    const emailMessage = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #059669;">Welcome to AyurCare, ${name}!</h2>
        <p>Your dietitian has created an account for you.</p>
        <p>Here are your login credentials:</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>
        <p>Please login at <a href="${process.env.FRONTEND_URL}/auth/login">AyurCare Portal</a> and change your password.</p>
        <p>Best regards,<br>The AyurCare Team</p>
      </div>
    `;

    try {
      await sendEmail({
        to: email,
        subject: 'Your AyurCare Account Credentials',
        html: emailMessage
      });
      console.log(`Email sent to ${email}`);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // We don't want to crash the request if email fails, but we should let the frontend know
      return res.status(201).json({
        success: true,
        message: 'Patient created, but email failed. Please note password manually.',
        tempPassword // Fallback
      });
    }
    // -----------------------

    res.status(201).json({
      success: true,
      message: 'Patient created and email sent successfully',
      patient: {
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        role: patient.role
      }
      // Note: We REMOVED tempPassword from here for security, 
      // unless email failed (handled in catch block above)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all patients for the logged-in Dietitian
// @route   GET /api/dietitian/patients
// @access  Private (Dietitian only)
exports.getMyPatients = async (req, res) => {
  try {
    // Find users where "createdByDietitian" matches the current user ID
    const patients = await User.find({ 
      createdByDietitian: req.user._id,
      role: 'patient' 
    }).select('-passwordHash'); // Do not send passwords back

    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get single patient by ID
// @route   GET /api/dietitian/patients/:id
// @access  Private (Dietitian)
exports.getPatientById = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id).select('-passwordHash');
    
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update patient details
// @route   PUT /api/dietitian/patients/:id
exports.updatePatient = async (req, res) => {
  try {
    const { name, mobile, age, gender, ayurvedicDosha, allergies } = req.body;
    
    // Find patient and ensure they belong to this dietitian
    const patient = await User.findOne({ 
      _id: req.params.id, 
      createdByDietitian: req.user._id 
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found or unauthorized' });
    }

    // Update fields
    patient.name = name || patient.name;
    patient.mobile = mobile || patient.mobile;
    patient.age = age || patient.age;
    patient.gender = gender || patient.gender;
    patient.ayurvedicDosha = ayurvedicDosha || patient.ayurvedicDosha;
    patient.allergies = allergies || patient.allergies;

    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a patient
// @route   DELETE /api/dietitian/patients/:id
exports.deletePatient = async (req, res) => {
  try {
    const patient = await User.findOneAndDelete({ 
      _id: req.params.id, 
      createdByDietitian: req.user._id 
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found or unauthorized' });
    }

    // Optional: Delete their diet plans and intake logs here too to keep DB clean
    // await DietPlan.deleteMany({ patient: patient._id });
    // await IntakeLog.deleteMany({ patient: patient._id });

    res.json({ message: 'Patient removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};