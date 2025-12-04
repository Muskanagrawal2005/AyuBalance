import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../api/axiosInstance';

const AddFoodModal = ({ onClose, onSuccess }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      calories: '',
      protein_g: '',
      carbs_g: '',
      fat_g: '',
      rasa: 'Sweet',
      virya: 'Cooling',
      vata: 'neutral',
      pitta: 'neutral',
      kapha: 'neutral',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      calories: Yup.number().required('Required'),
    }),
    onSubmit: async (values) => {
      // Structure the data to match Backend Schema
      const payload = {
        name: values.name,
        calories: values.calories,
        protein_g: values.protein_g,
        carbs_g: values.carbs_g,
        fat_g: values.fat_g,
        rasa: values.rasa,
        virya: values.virya,
        doshaEffect: {
          vata: values.vata,
          pitta: values.pitta,
          kapha: values.kapha
        }
      };

      try {
        await api.post('/food', payload);
        onSuccess();
        onClose();
      } catch (error) {
        alert('Error adding food');
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Add Food Item</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Food Name</label>
              <input type="text" {...formik.getFieldProps('name')} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Calories</label>
              <input type="number" {...formik.getFieldProps('calories')} className="w-full border p-2 rounded" />
            </div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Protein (g)</label>
              <input type="number" {...formik.getFieldProps('protein_g')} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Carbs (g)</label>
              <input type="number" {...formik.getFieldProps('carbs_g')} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium">Fat (g)</label>
              <input type="number" {...formik.getFieldProps('fat_g')} className="w-full border p-2 rounded" />
            </div>
          </div>

          {/* Ayurveda */}
          <h3 className="font-semibold text-emerald-700 mt-4">Ayurvedic Properties</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Rasa (Taste)</label>
              <select {...formik.getFieldProps('rasa')} className="w-full border p-2 rounded">
                <option value="Sweet">Sweet (Madhura)</option>
                <option value="Sour">Sour (Amla)</option>
                <option value="Salty">Salty (Lavana)</option>
                <option value="Pungent">Pungent (Katu)</option>
                <option value="Bitter">Bitter (Tikta)</option>
                <option value="Astringent">Astringent (Kashaya)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Virya (Potency)</label>
              <select {...formik.getFieldProps('virya')} className="w-full border p-2 rounded">
                <option value="Cooling">Cooling (Sheeta)</option>
                <option value="Heating">Heating (Ushna)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium">Vata Effect</label>
              <select {...formik.getFieldProps('vata')} className="w-full border p-2 rounded">
                <option value="neutral">Neutral</option>
                <option value="pacifies">Pacifies</option>
                <option value="aggravates">Aggravates</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Pitta Effect</label>
              <select {...formik.getFieldProps('pitta')} className="w-full border p-2 rounded">
                <option value="neutral">Neutral</option>
                <option value="pacifies">Pacifies</option>
                <option value="aggravates">Aggravates</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Kapha Effect</label>
              <select {...formik.getFieldProps('kapha')} className="w-full border p-2 rounded">
                <option value="neutral">Neutral</option>
                <option value="pacifies">Pacifies</option>
                <option value="aggravates">Aggravates</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Save Food Item</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFoodModal;