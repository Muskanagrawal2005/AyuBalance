import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        // Call backend verification endpoint
        // Adjust the URL based on your specific backend route structure
        await api.post('/auth/verify-email', { token });
        
        setStatus('success');
        setMessage('Email verified successfully!');
        
        // Auto-redirect after 3 seconds
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
        
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. Link might be expired.');
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full text-center relative z-10 border border-white/50">
        
        {/* --- STATE: VERIFYING --- */}
        {status === 'verifying' && (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="w-20 h-20 mb-6 relative">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-800 mb-2">Just a moment...</h2>
            <p className="text-slate-500">We are verifying your email address.</p>
          </div>
        )}

        {/* --- STATE: SUCCESS --- */}
        {status === 'success' && (
          <div className="flex flex-col items-center animate-scale-up">
            <div className="w-20 h-20 mb-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl shadow-inner">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-800 mb-2">Verified!</h2>
            <p className="text-slate-500 mb-6">{message}</p>
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest animate-pulse">Redirecting to Login...</p>
          </div>
        )}

        {/* --- STATE: ERROR --- */}
        {status === 'error' && (
          <div className="flex flex-col items-center animate-shake">
            <div className="w-20 h-20 mb-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl shadow-inner border border-red-100">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-800 mb-2">Verification Failed</h2>
            <p className="text-red-500 mb-8 bg-red-50 px-4 py-2 rounded-lg text-sm font-bold">{message}</p>
            
            <button 
              onClick={() => navigate('/auth/login')}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-transform hover:scale-[1.02]"
            >
              Back to Login
            </button>
          </div>
        )}

      </div>
      
      {/* Brand Footer */}
      <p className="mt-8 text-slate-400 text-sm font-bold tracking-wider uppercase">AyurCare Wellness</p>
    </div>
  );
};

export default VerifyEmail;