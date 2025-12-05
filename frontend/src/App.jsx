import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import DietitianDashboard from './pages/dietitian/Dashboard';
import MyPatients from './pages/dietitian/MyPatients';
import FoodDatabase from './pages/dietitian/FoodDatabase';
import PatientDetails from './pages/dietitian/PatientDetails';
import PatientDashboard from './pages/patient/PatientDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import BookAppointment from './pages/patient/BookAppointment';
import LogIntake from './pages/patient/LogIntake';
import Appointments from './pages/dietitian/Appointments';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';

function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/verify-email" element={<VerifyEmail />} />

      {/* ---------------- DIETITIAN ROUTES ---------------- */}
      <Route element={<ProtectedRoute allowedRoles={['dietitian']} />}>
        <Route path="/dashboard" element={<DietitianDashboard />}>
          <Route index element={<div><h2>Dashboard Overview</h2></div>} />
          <Route path="patients" element={<MyPatients />} />
          <Route path="patients/:id" element={<PatientDetails />} />
          <Route path="food-database" element={<FoodDatabase />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>
      </Route>

      {/* ---------------- PATIENT ROUTES ---------------- */}
      {/* 👇 ADD THIS SECTION */}
      <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
      </Route>


      {/* Redirect Root to Login */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="/patient/log-intake" element={<LogIntake />} />
      <Route path="/patient/book-appointment" element={<BookAppointment />} />
    </Routes>
  );
}

export default App;