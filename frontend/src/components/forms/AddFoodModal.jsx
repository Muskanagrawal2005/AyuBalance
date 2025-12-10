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

  // Shared Input Styles
  const inputClass = "w-full p-3 bg-earth-50 border border-earth-200 rounded-xl font-medium text-earth-800 outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all";
  const labelClass = "block text-xs font-bold text-earth-500 uppercase tracking-wider mb-1 ml-1";

  return (
    <div className="fixed inset-0 bg-primary-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl p-8 overflow-hidden relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-earth-100">
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary-900">Add Ingredient</h2>
            <p className="text-earth-500 text-sm">Expand your Ayurvedic pantry.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-earth-50 rounded-full text-earth-400 hover:bg-earth-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-8 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
          
          {/* 1. Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Food Name</label>
              <input 
                type="text" 
                placeholder="e.g. Mung Beans"
                {...formik.getFieldProps('name')} 
                className={inputClass} 
              />
            </div>
            <div>
              <label className={labelClass}>Energy (kcal)</label>
              <input 
                type="number" 
                placeholder="0"
                {...formik.getFieldProps('calories')} 
                className={inputClass} 
              />
            </div>
          </div>

          {/* 2. Macros */}
          <div className="bg-earth-50/50 p-6 rounded-2xl border border-earth-100">
            <h3 className="text-sm font-bold text-primary-800 mb-4 flex items-center gap-2">
              <span>📊</span> Macro Composition
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Protein (g)</label>
                <input type="number" {...formik.getFieldProps('protein_g')} className={`bg-white ${inputClass}`} />
              </div>
              <div>
                <label className={labelClass}>Carbs (g)</label>
                <input type="number" {...formik.getFieldProps('carbs_g')} className={`bg-white ${inputClass}`} />
              </div>
              <div>
                <label className={labelClass}>Fat (g)</label>
                <input type="number" {...formik.getFieldProps('fat_g')} className={`bg-white ${inputClass}`} />
              </div>
            </div>
          </div>

          {/* 3. Ayurvedic Properties */}
          <div>
            <h3 className="text-sm font-bold text-primary-800 mb-4 flex items-center gap-2">
              <span>🌿</span> Ayurvedic Properties
            </h3>
            
            {/* Taste & Potency */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className={labelClass}>Rasa (Taste)</label>
                <select {...formik.getFieldProps('rasa')} className={inputClass}>
                  <option value="Sweet">Sweet (Madhura)</option>
                  <option value="Sour">Sour (Amla)</option>
                  <option value="Salty">Salty (Lavana)</option>
                  <option value="Pungent">Pungent (Katu)</option>
                  <option value="Bitter">Bitter (Tikta)</option>
                  <option value="Astringent">Astringent (Kashaya)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Virya (Potency)</label>
                <select {...formik.getFieldProps('virya')} className={inputClass}>
                  <option value="Cooling">❄️ Cooling (Sheeta)</option>
                  <option value="Heating">🔥 Heating (Ushna)</option>
                </select>
              </div>
            </div>

            {/* Dosha Effects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-xl border border-purple-100 bg-purple-50/50">
                <label className="block text-xs font-bold text-purple-700 uppercase mb-2">Vata Effect</label>
                <select {...formik.getFieldProps('vata')} className="w-full p-2 bg-white border border-purple-100 rounded-lg text-sm outline-none focus:border-purple-300">
                  <option value="neutral">Neutral</option>
                  <option value="pacifies">⬇ Pacifies</option>
                  <option value="aggravates">⬆ Aggravates</option>
                </select>
              </div>
              
              <div className="p-3 rounded-xl border border-orange-100 bg-orange-50/50">
                <label className="block text-xs font-bold text-orange-700 uppercase mb-2">Pitta Effect</label>
                <select {...formik.getFieldProps('pitta')} className="w-full p-2 bg-white border border-orange-100 rounded-lg text-sm outline-none focus:border-orange-300">
                  <option value="neutral">Neutral</option>
                  <option value="pacifies">⬇ Pacifies</option>
                  <option value="aggravates">⬆ Aggravates</option>
                </select>
              </div>

              <div className="p-3 rounded-xl border border-blue-100 bg-blue-50/50">
                <label className="block text-xs font-bold text-blue-700 uppercase mb-2">Kapha Effect</label>
                <select {...formik.getFieldProps('kapha')} className="w-full p-2 bg-white border border-blue-100 rounded-lg text-sm outline-none focus:border-blue-300">
                  <option value="neutral">Neutral</option>
                  <option value="pacifies">⬇ Pacifies</option>
                  <option value="aggravates">⬆ Aggravates</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-earth-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 rounded-xl font-bold text-earth-600 hover:bg-earth-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-8 py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-900/20 hover:scale-[1.02] transition-transform"
            >
              Add to Database
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddFoodModal;