import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../api/axiosInstance';

const EditPatientModal = ({ patient, onClose, onSuccess }) => {
  const formik = useFormik({
    // Pre-fill with existing patient data
    initialValues: {
      name: patient.name || '',
      mobile: patient.mobile || '',
      age: patient.age || '',
      gender: patient.gender || 'male',
      ayurvedicDosha: patient.ayurvedicDosha || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      age: Yup.number().required('Age is required'),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await api.put(`/dietitian/patients/${patient._id}`, values);
        alert("Patient updated successfully!");
        onSuccess(); // Refresh parent data
        onClose();
      } catch (error) {
        setStatus(error.response?.data?.message || 'Update failed');
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Edit Patient</h2>
        {formik.status && <p className="text-red-500 mb-2">{formik.status}</p>}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input type="text" {...formik.getFieldProps('name')} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Mobile</label>
            <input type="text" {...formik.getFieldProps('mobile')} className="w-full border p-2 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="w-1/3">
               <label className="block text-sm font-medium">Age</label>
               <input type="number" {...formik.getFieldProps('age')} className="w-full border p-2 rounded" />
            </div>
            <div className="w-1/3">
               <label className="block text-sm font-medium">Gender</label>
               <select {...formik.getFieldProps('gender')} className="w-full border p-2 rounded">
                 <option value="male">Male</option>
                 <option value="female">Female</option>
                 <option value="other">Other</option>
               </select>
            </div>
            <div className="w-1/3">
               <label className="block text-sm font-medium">Dosha</label>
               <select {...formik.getFieldProps('ayurvedicDosha')} className="w-full border p-2 rounded">
                 <option value="">Select</option>
                 <option value="Vata">Vata</option>
                 <option value="Pitta">Pitta</option>
                 <option value="Kapha">Kapha</option>
               </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatientModal;