import { Routes, Route, Navigate } from "react-router-dom";
import Landing from './pages/Landing';
import Login from "./pages/auth/Login";
import DietitianDashboard from "./pages/dietitian/Dashboard";
import MyPatients from "./pages/dietitian/MyPatients";
import FoodDatabase from "./pages/dietitian/FoodDatabase";
import PatientDetails from "./pages/dietitian/PatientDetails";
import PatientDashboard from "./pages/patient/PatientDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import BookAppointment from "./pages/patient/BookAppointment";
import LogIntake from "./pages/patient/LogIntake";
import Appointments from "./pages/dietitian/Appointments";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import DashboardOverview from "./pages/dietitian/DashboardOverview";

function App() {
  return (
    <Routes>
      {/* 1. HOME PAGE (Landing) - This fixes the redirect issue */}
      <Route path="/" element={<Landing />} />

      {/* Auth Routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/verify-email" element={<VerifyEmail />} />

      {/* ---------------- DIETITIAN PROTECTED ROUTES ---------------- */}
      <Route element={<ProtectedRoute allowedRoles={["dietitian"]} />}>
        <Route path="/dashboard" element={<DietitianDashboard />}>
          <Route index element={<DashboardOverview />} />
          <Route path="patients" element={<MyPatients />} />
          <Route path="patients/:id" element={<PatientDetails />} />
          <Route path="food-database" element={<FoodDatabase />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>
      </Route>

      {/* ---------------- PATIENT PROTECTED ROUTES ---------------- */}
      <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        {/* I moved these INSIDE the protected route so only logged-in patients can see them */}
        <Route path="/patient/log-intake" element={<LogIntake />} />
        <Route path="/patient/book-appointment" element={<BookAppointment />} />
      </Route>

      {/* Catch-all: If route doesn't exist, go to Landing Page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;