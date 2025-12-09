import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosInstance";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Logic remains exactly the same
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 chars")
      .required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await api.post("/auth/register", values);
        alert("Registration successful! Please check your email to verify.");
        navigate("/auth/login");
      } catch (error) {
        setStatus(error.response?.data?.message || "Registration failed");
      }
      setSubmitting(false);
    },
  });

  return (
    // 1. MAIN CONTAINER: Matching the Login Page Gradient & Animation
    <div className="min-h-screen flex bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 animate-gradient-slow">
      {/* LEFT SIDE: Brand/Welcome (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-1/4 -left-20 mix-blend-overlay"></div>
        <div className="absolute w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl bottom-1/4 right-20 mix-blend-overlay"></div>

        <div className="z-10 text-white p-12 max-w-lg relative">
          <h1 className="text-5xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
            Join the future of Ayurveda.
          </h1>
          <p className="text-primary-50 text-lg drop-shadow leading-relaxed">
            Create your professional practice account to manage patients, build
            diet plans, and track progress efficiently.
          </p>

          {/* Trust Indicators */}
          <div className="mt-12 flex gap-8">
            <div>
              <h4 className="text-3xl font-bold font-serif">100+</h4>
              <p className="text-primary-200 text-sm uppercase tracking-wider">
                Dietitians
              </p>
            </div>
            <div>
              <h4 className="text-3xl font-bold font-serif">Secure</h4>
              <p className="text-primary-200 text-sm uppercase tracking-wider">
                HIPAA Compliant
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: The Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white/95 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-3xl font-serif font-bold text-primary-900 mb-2">
              Create Account
            </h2>
            <p className="text-earth-600">
              Start your journey with AyurCare today.
            </p>
          </div>

          {/* Error Alert */}
          {formik.status && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-center shadow-sm">
              <span className="mr-2 text-lg">⚠️</span> {formik.status}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-bold text-primary-900 mb-1.5 ml-1">
                Full Name
              </label>
              <input
                type="text"
                {...formik.getFieldProps("name")}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all bg-earth-50/50 ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-300 focus:border-red-500 bg-red-50/50"
                    : "border-earth-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                }`}
                placeholder="Dr. Aditi Sharma"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-xs mt-1 ml-1 font-bold">
                  {formik.errors.name}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-primary-900 mb-1.5 ml-1">
                Email Address
              </label>
              <input
                type="email"
                {...formik.getFieldProps("email")}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all bg-earth-50/50 ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-300 focus:border-red-500 bg-red-50/50"
                    : "border-earth-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                }`}
                placeholder="doctor@example.com"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-xs mt-1 ml-1 font-bold">
                  {formik.errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-primary-900 mb-1.5 ml-1">
                Password
              </label>
              <input
                type="password"
                {...formik.getFieldProps("password")}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all bg-earth-50/50 ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-300 focus:border-red-500 bg-red-50/50"
                    : "border-earth-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                }`}
                placeholder="••••••••"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-xs mt-1 ml-1 font-bold">
                  {formik.errors.password}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-800 hover:to-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-900/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {formik.isSubmitting
                ? "Creating Practice..."
                : "Register as Dietitian"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm border-t border-earth-100 pt-6">
            <p className="text-earth-600">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="font-bold text-primary-700 hover:text-primary-900 underline decoration-primary-300 underline-offset-4 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
