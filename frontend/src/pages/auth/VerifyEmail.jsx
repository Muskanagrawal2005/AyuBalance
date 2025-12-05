import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from "jwt-decode";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { user } = useAuth(); // To access setUser or we handle token manually
  
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    if (!token) {
      setStatus('Invalid Link');
      return;
    }

    const verify = async () => {
      try {
        const { data } = await api.post('/auth/verify-email', { token });
        
        // Auto Login Logic (Optional, but nice UX)
        localStorage.setItem('accessToken', data.accessToken);
        // We can't easily update Context here without reloading or a setUser method exposed
        // Simplest way: Redirect to Dashboard, AuthProvider will pick up token on reload/navigation
        
        setStatus('Success! Redirecting...');
        setTimeout(() => {
           window.location.href = "/dashboard"; // Force reload to init auth
        }, 2000);

      } catch (error) {
        setStatus(error.response?.data?.message || 'Verification Failed');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        <p className={`text-lg ${status.includes('Success') ? 'text-green-600' : 'text-gray-700'}`}>
          {status}
        </p>
        
        {!status.includes('Verifying') && !status.includes('Redirecting') && (
           <Link to="/auth/login" className="block mt-6 text-emerald-600 font-bold hover:underline">
             Back to Login
           </Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;