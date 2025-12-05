import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // <--- Import this!

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      // 1. Attempt Login
      const result = await login(values.email, values.password);

      if (result.success) {
        // 2. Decode the token to find the Role
        const token = localStorage.getItem('accessToken');

        try {
          const decoded = jwtDecode(token);

          // 3. Traffic Control: Redirect based on Role
          if (decoded.role === 'dietitian') {
            navigate('/dashboard');
          } else if (decoded.role === 'patient') {
            navigate('/patient/dashboard'); // <--- The Correct Patient Route
          } else {
            // Fallback
            navigate('/');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Ayurveda Practice Login
        </h2>

        {formik.status && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center">
            {formik.status}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              {...formik.getFieldProps('email')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...formik.getFieldProps('password')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400"
          >
            {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/auth/register" className="font-medium text-emerald-600 hover:text-emerald-500">
              Register as Dietitian
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;