import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // <--- Import this!

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      // 1. Attempt Login
      const result = await login(values.email, values.password);

      if (result.success) {
        // 2. Decode the token to find the Role
        const token = localStorage.getItem("accessToken");

        try {
          const decoded = jwtDecode(token);

          // 3. Traffic Control: Redirect based on Role
          if (decoded.role === "dietitian") {
            navigate("/dashboard");
          } else if (decoded.role === "patient") {
            navigate("/patient/dashboard"); // <--- The Correct Patient Route
          } else {
            // Fallback
            navigate("/");
          }
        } catch (e) {
          console.error("Token decode failed", e);
          setStatus("Login error: Invalid token");
        }
      } else {
        setStatus(result.message);
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 bg-[length:300%_300%] animate-gradient-slow">
      
      {/* LEFT SIDE: Text on the moving background */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden">
        {/*kept the subtle blur orb for extra depth, made it lighter */}
        <div className="absolute w-96 h-96 bg-primary-500/30 rounded-full blur-3xl -top-20 -left-20 mix-blend-overlay"></div>
        
        <div className="z-10 text-white p-12 max-w-lg">
          {/* Added drop-shadow to text for better readability against moving bg */}
          <h1 className="text-5xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
            Balance your practice naturally.
          </h1>
          <p className="text-primary-50 text-lg drop-shadow">
            Welcome to the comprehensive Ayurvedic management platform for modern dietitians.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: The Form Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        {/* 2. FORM CARD: Wrapped the form in a white, shadowed card */}
        <div className="bg-white/95 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
          
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-serif font-bold text-primary-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-earth-800">Please enter your details to sign in.</p>
          </div>

          {/* Error Alert */}
          {formik.status && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 flex items-center">
              <span className="mr-2">⚠️</span> {formik.status}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-primary-900 mb-1">Email Address</label>
              <input
                type="email"
                {...formik.getFieldProps('email')}
                // Made inputs slightly darker bg for contrast on white card
                className={`w-full px-4 py-3 rounded-lg border outline-none transition-all bg-earth-50/50 ${
                  formik.touched.email && formik.errors.email
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-earth-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                }`}
                placeholder="doctor@ayurveda.com"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.email}</div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-primary-900 mb-1">Password</label>
              <input
                type="password"
                {...formik.getFieldProps('password')}
                className={`w-full px-4 py-3 rounded-lg border outline-none transition-all bg-earth-50/50 ${
                  formik.touched.password && formik.errors.password
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-earth-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                }`}
                placeholder="••••••••"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-xs mt-1 font-medium">{formik.errors.password}</div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              // Made button gradient to match theme
              className="w-full py-3 px-4 bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-800 hover:to-primary-700 text-white rounded-lg font-bold shadow-lg shadow-primary-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center text-sm">
            <p className="text-earth-800">
              Don't have an account?{' '}
              <Link to="/auth/register" className="font-bold text-primary-700 hover:text-primary-800 underline decoration-primary-300 underline-offset-4 transition-colors">
                Register as Dietitian
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
