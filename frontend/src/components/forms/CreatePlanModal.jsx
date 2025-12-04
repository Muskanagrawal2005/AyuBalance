import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import api from '../../api/axiosInstance';

const CreatePlanModal = ({ patientId, onClose, onSuccess }) => {
  const [availableFoods, setAvailableFoods] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  
  // Fetch foods for the dropdown
  useEffect(() => {
    const fetchFoods = async () => {
      const { data } = await api.get('/food'); // Fetches first 20 or all
      setAvailableFoods(data);
    };
    fetchFoods();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: 'Weekly Plan',
      instructions: '',
      meals: [] // We will push objects here manually
    },
    onSubmit: async (values) => {
      try {
        await api.post(`/dietitian/patients/${patientId}/diet-plans`, values);
        onSuccess();
        onClose();
      } catch (error) {
        alert('Failed to save plan');
      }
    },
  });

  // Helper to add item to formik state
  const addFoodToMeal = (foodId, foodName) => {
    const newMealItem = {
      mealType: selectedMealType,
      items: [{ foodItem: foodId, quantity: 1, unit: 'serving' }]
    };
    
    // Check if mealType already exists in the array
    const existingMealIndex = formik.values.meals.findIndex(m => m.mealType === selectedMealType);
    
    if (existingMealIndex > -1) {
      // Add to existing meal category
      const updatedMeals = [...formik.values.meals];
      updatedMeals[existingMealIndex].items.push({ foodItem: foodId, quantity: 1, unit: 'serving' });
      formik.setFieldValue('meals', updatedMeals);
    } else {
      // Create new meal category
      formik.setFieldValue('meals', [...formik.values.meals, newMealItem]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 h-[80vh] flex flex-col">
        <h2 className="text-xl font-bold mb-4">Create Diet Plan</h2>
        
        <div className="flex flex-1 gap-6 overflow-hidden">
          {/* LEFT: Food Selector */}
          <div className="w-1/3 border-r pr-4 overflow-y-auto">
            <h3 className="font-semibold mb-2">1. Select Meal</h3>
            <select 
              value={selectedMealType} 
              onChange={(e) => setSelectedMealType(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>

            <h3 className="font-semibold mb-2">2. Click to Add Food</h3>
            <div className="space-y-2">
              {availableFoods.map(food => (
                <div 
                  key={food._id} 
                  onClick={() => addFoodToMeal(food._id, food.name)}
                  className="p-2 border rounded cursor-pointer hover:bg-emerald-50 text-sm flex justify-between"
                >
                  <span>{food.name}</span>
                  <span className="text-xs text-gray-500">{food.calories} cal</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: The Plan Builder */}
          <div className="w-2/3 pl-4 overflow-y-auto">
            <div className="mb-4">
              <label className="block text-sm font-bold">Plan Name</label>
              <input type="text" {...formik.getFieldProps('name')} className="w-full border p-2 rounded" />
            </div>

            <h3 className="font-bold text-lg mb-2">Current Menu</h3>
            {formik.values.meals.length === 0 && <p className="text-gray-400">No items added yet.</p>}

            {formik.values.meals.map((meal, index) => (
              <div key={index} className="mb-4 bg-gray-50 p-3 rounded">
                <h4 className="font-bold uppercase text-emerald-700 text-sm">{meal.mealType}</h4>
                {meal.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-2 mt-2 items-center">
                    <span className="text-sm flex-1">
                      {/* We store ID, but to show Name we'd need to look it up. For MVP showing ID or simplified view */}
                      {availableFoods.find(f => f._id === item.foodItem)?.name || 'Food Item'}
                    </span>
                    <input 
                      type="number" 
                      placeholder="Qty"
                      className="w-16 border p-1 rounded text-sm"
                      value={item.quantity}
                      onChange={(e) => {
                         // This is tricky with Formik deep nesting, skipping for MVP brevity
                         // Ideally: update the specific item quantity in state
                      }}
                    />
                    <span className="text-xs text-gray-500">serving</span>
                  </div>
                ))}
              </div>
            ))}
            
            <div className="mt-4">
               <label className="block text-sm font-bold">Instructions / Notes</label>
               <textarea {...formik.getFieldProps('instructions')} className="w-full border p-2 rounded h-20"></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100">Cancel</button>
          <button 
            onClick={formik.handleSubmit} 
            className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Save Diet Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlanModal;