import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';

const LogIntake = () => {
  // State for Date & Data
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyLog, setDailyLog] = useState(null);
  
  // State for Adding Food
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [loading, setLoading] = useState(false);

  // 1. Fetch Log when Date changes
  const fetchLog = async () => {
    try {
      const { data } = await api.get(`/patient/intake?date=${selectedDate}`);
      setDailyLog(data);
    } catch (error) {
      console.error("Error fetching log");
    }
  };

  useEffect(() => {
    fetchLog();
  }, [selectedDate]);

  // 2. Search Food Logic
  useEffect(() => {
    const searchFood = async () => {
      if (searchTerm.length < 2) return;
      const { data } = await api.get(`/food?search=${searchTerm}`);
      setSearchResults(data);
    };
    
    const timeout = setTimeout(searchFood, 500); // Debounce
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // 3. Add Food Logic
  const handleAddFood = async (food) => {
    try {
      await api.post('/patient/intake', {
        date: selectedDate,
        mealType: selectedMeal,
        foodId: food._id,
        quantity: 1, // Default to 1 serving for now
        unit: 'serving'
      });
      // Refresh the log to show new item
      fetchLog();
      setSearchTerm(''); // Clear search
      setSearchResults([]);
    } catch (error) {
      alert("Failed to log food");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Daily Food Log</h1>

      {/* Date Picker */}
      <div className="mb-6 flex items-center gap-4 bg-white p-4 rounded shadow">
        <label className="font-medium text-gray-700">Select Date:</label>
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-emerald-500"
        />
        <div className="ml-auto text-emerald-800 font-bold">
          Total Calories: {dailyLog?.totalCalories || 0}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT COLUMN: Add Food Form */}
        <div className="bg-white p-6 rounded shadow h-fit">
          <h2 className="text-lg font-bold mb-4">Add Food</h2>
          
          {/* Meal Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Meal Type</label>
            <select 
              value={selectedMeal} 
              onChange={(e) => setSelectedMeal(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search food (e.g. Rice)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border p-2 rounded"
            />
            
            {/* Search Results Dropdown */}
            {/* Search Results Dropdown */}
{searchResults.length > 0 && (
  <div className="absolute top-full left-0 w-full bg-white border shadow-lg max-h-48 overflow-y-auto z-10">
    {searchResults.map(food => (
      <div 
        key={food._id} 
        // We remove the onClick from the parent div to avoid accidental clicks
        className="p-2 border-b flex justify-between items-center hover:bg-gray-50"
      >
        <div>
          <span className="font-medium text-gray-800">{food.name}</span>
          <span className="text-xs text-gray-500 ml-2">{food.calories} cal</span>
        </div>
        
        {/* explicit ADD BUTTON */}
        <button 
          onClick={() => handleAddFood(food)}
          className="bg-emerald-600 text-white px-3 py-1 rounded text-xs hover:bg-emerald-700 transition"
        >
          Add +
        </button>
      </div>
    ))}
  </div>
)}
          </div>
        </div>

        {/* RIGHT COLUMN: Today's Log */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Logged Meals</h2>
          
          {dailyLog && ['breakfast', 'lunch', 'dinner', 'snack'].map(meal => (
            <div key={meal} className="mb-4">
              <h3 className="font-bold uppercase text-xs text-gray-500 border-b mb-2">{meal}</h3>
              {dailyLog.meals[meal].length === 0 ? (
                <p className="text-xs text-gray-400 italic">No items</p>
              ) : (
                <ul className="space-y-2">
                  {dailyLog.meals[meal].map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span>{item.foodItem?.name || 'Unknown'}</span>
                      <span className="text-gray-500">{item.calories} cal</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogIntake;