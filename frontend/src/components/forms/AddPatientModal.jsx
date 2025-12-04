import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../api/axiosInstance';

const AddPatientModal = ({ onClose, onSuccess }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      mobile: '',
      age: '',
      gender: 'male',
      ayurvedicDosha: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      age: Yup.number().required('Age is required'),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        // API Call to create patient
        const { data } = await api.post('/dietitian/patients', values);
        
        // Show the temporary password to the Dietitian

        alert(`Patient Created Successfully!\n\nAn email with login details has been sent to ${values.email}.`);
        
        onSuccess(); // Refresh the list
        onClose();   // Close the modal
      } catch (error) {
        setStatus(error.response?.data?.message || 'Error creating patient');
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Add New Patient</h2>
        
        {formik.status && <p className="text-red-500 mb-2">{formik.status}</p>}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            {...formik.getFieldProps('name')}
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            {...formik.getFieldProps('email')}
            className="w-full border p-2 rounded"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Age"
              {...formik.getFieldProps('age')}
              className="w-1/3 border p-2 rounded"
            />
            <select {...formik.getFieldProps('gender')} className="w-1/3 border p-2 rounded">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <select {...formik.getFieldProps('ayurvedicDosha')} className="w-1/3 border p-2 rounded">
              <option value="">Dosha</option>
              <option value="Vata">Vata</option>
              <option value="Pitta">Pitta</option>
              <option value="Kapha">Kapha</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={formik.isSubmitting}
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              {formik.isSubmitting ? 'Creating...' : 'Create Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;