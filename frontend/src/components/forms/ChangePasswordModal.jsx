import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../api/axiosInstance';

const ChangePasswordModal = ({ onClose }) => {
  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string().min(6, 'Must be at least 6 chars').required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        // Assuming your backend has this endpoint. 
        // If not, we might need to use the generic profile update endpoint.
        await api.post('/auth/change-password', {
          oldPassword: values.currentPassword,
          newPassword: values.newPassword
        });
        
        alert("Password updated successfully!");
        onClose();
      } catch (error) {
        setStatus(error.response?.data?.message || 'Failed to update password');
      }
      setSubmitting(false);
    },
  });

  const inputClass = "w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 relative overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
            🔐
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Secure Your Account</h2>
          <p className="text-slate-500 text-sm mt-1">Update your temporary password.</p>
        </div>

        {formik.status && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center border border-red-100">
            {formik.status}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          
          <div>
            <label className={labelClass}>Current Password</label>
            <input 
              type="password" 
              {...formik.getFieldProps('currentPassword')} 
              className={inputClass} 
              placeholder="••••••••"
            />
            {formik.touched.currentPassword && formik.errors.currentPassword && (
              <div className="text-red-500 text-xs mt-1 ml-1 font-bold">{formik.errors.currentPassword}</div>
            )}
          </div>

          <div>
            <label className={labelClass}>New Password</label>
            <input 
              type="password" 
              {...formik.getFieldProps('newPassword')} 
              className={inputClass} 
              placeholder="••••••••"
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <div className="text-red-500 text-xs mt-1 ml-1 font-bold">{formik.errors.newPassword}</div>
            )}
          </div>

          <div>
            <label className={labelClass}>Confirm New Password</label>
            <input 
              type="password" 
              {...formik.getFieldProps('confirmPassword')} 
              className={inputClass} 
              placeholder="••••••••"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="text-red-500 text-xs mt-1 ml-1 font-bold">{formik.errors.confirmPassword}</div>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={formik.isSubmitting}
              className="flex-1 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:scale-[1.02] transition-transform disabled:opacity-70"
            >
              {formik.isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;