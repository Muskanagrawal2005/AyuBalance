import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';

// Define tabs outside component to prevent re-creation
const MEAL_TABS = [
  { id: 'breakfast', label: 'Breakfast', icon: '🌅', color: 'from-orange-400 to-pink-500' },
  { id: 'lunch', label: 'Lunch', icon: '☀️', color: 'from-blue-400 to-cyan-500' },
  { id: 'dinner', label: 'Dinner', icon: '🌙', color: 'from-indigo-500 to-purple-600' },
  { id: 'snack', label: 'Snack', icon: '🍎', color: 'from-emerald-400 to-teal-500' },
];

const LogIntake = () => {
  // --- STATE ---
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyLog, setDailyLog] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState('breakfast'); // Default is breakfast
  const [loading, setLoading] = useState(false);

  // --- FETCH LOGIC ---
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

  // --- SEARCH LOGIC ---
  useEffect(() => {
    const searchFood = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const { data } = await api.get(`/food?search=${searchTerm}`);
        setSearchResults(data);
      } catch (error) {
        console.error("Search failed");
      }
    };

    const timeout = setTimeout(searchFood, 400); // Debounce
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // --- ADD FOOD LOGIC ---
  const handleAddFood = async (food) => {
    setLoading(true);
    // console.log("Adding food to:", selectedMeal); // Debugging line
    try {
      await api.post('/patient/intake', {
        date: selectedDate,
        mealType: selectedMeal, // This uses the current state
        foodId: food._id,
        quantity: 1, 
        unit: 'serving'
      });
      
      // Refresh log immediately
      await fetchLog();
      
      // Clear search but KEEP the selected meal so they can add more items to it
      setSearchTerm('');
      setSearchResults([]);
    } catch (error) {
      alert("Failed to log food. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- HELPER: CALCULATE PROGRESS ---
  const totalCalories = dailyLog?.totalCalories || 0;
  const calorieGoal = 2000; // Static goal for visual
  const progressPercent = Math.min((totalCalories / calorieGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-violet-400 text-slate-900 font-sans pb-20">
      
      {/* --- 1. HEADER & DATE PICKER --- */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Smart</span> Food Diary
          </h1>
          
          <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none font-bold text-slate-700 focus:ring-0 cursor-pointer outline-none px-2"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: INPUT AREA (7 Cols) --- */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. Meal Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {MEAL_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button" // Important: Prevents form submission behavior
                onClick={() => setSelectedMeal(tab.id)}
                className={`relative overflow-hidden p-4 rounded-2xl border-2 transition-all duration-300 group ${
                  selectedMeal === tab.id
                    ? 'border-transparent shadow-lg scale-105 ring-2 ring-offset-2 ring-indigo-500/30'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {/* Active Background Gradient */}
                {selectedMeal === tab.id && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${tab.color} opacity-100`}></div>
                )}
                
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <span className="text-2xl filter drop-shadow-sm">{tab.icon}</span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    selectedMeal === tab.id ? 'text-white' : 'text-slate-500'
                  }`}>
                    {tab.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* 2. Search Bar */}
          <div className="relative group z-30">
            <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 group-focus-within:opacity-100 transition duration-500 blur`}></div>
            <div className="relative bg-white rounded-2xl shadow-xl flex items-center p-2">
              <div className="pl-4 text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              
              {/* Dynamic Placeholder confirms meal selection */}
              <input
                type="text"
                placeholder={`Search food for ${selectedMeal.toUpperCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 bg-transparent border-none outline-none text-lg font-medium text-slate-700 placeholder-slate-400"
                autoFocus
              />
              
              {loading && <div className="pr-4"><div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}
            </div>

            {/* Floating Search Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-80 overflow-y-auto animate-slide-up z-50">
                {searchResults.map((food) => (
                  <div 
                    key={food._id}
                    className="p-4 border-b border-slate-50 hover:bg-indigo-50 transition-colors flex justify-between items-center group cursor-pointer"
                    onClick={() => handleAddFood(food)}
                  >
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-700 transition-colors">{food.name}</h4>
                      <div className="flex gap-2 text-xs font-bold text-slate-400 mt-1">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">{food.calories} kcal</span>
                        <span>•</span>
                        <span>{food.protein_g}p</span>
                        <span>{food.carbs_g}c</span>
                        <span>{food.fat_g}f</span>
                      </div>
                    </div>
                    {/* Visual Add Button */}
                    <button className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center transition-all hover:bg-indigo-600 hover:text-white transform group-hover:scale-110">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Tips / Empty State */}
          {searchResults.length === 0 && (
            <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center">
              <p className="text-slate-400 font-medium">Currently adding to: <span className="font-bold text-indigo-600 uppercase">{selectedMeal}</span></p>
              <p className="text-slate-400 text-sm mt-1">Start typing to search our Ayurvedic pantry.</p>
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN: DAILY SUMMARY (5 Cols) --- */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Calorie Meter Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Intake</p>
                <h2 className="text-5xl font-black">{totalCalories}</h2>
                <p className="text-sm font-medium text-slate-400 mt-1">kcal consumed</p>
              </div>
              
              {/* Circular Progress Meter */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700" />
                  <circle 
                    cx="48" cy="48" r="40" 
                    stroke="currentColor" strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={251.2} 
                    strokeDashoffset={251.2 - (251.2 * progressPercent) / 100} 
                    className="text-indigo-400 transition-all duration-1000 ease-out" 
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xs font-bold">{Math.round(progressPercent)}%</span>
              </div>
            </div>
          </div>

          {/* 2. Logged Meals List */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Today's Log</h3>
            </div>
            
            <div className="divide-y divide-slate-50">
              {['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
                const items = dailyLog?.meals?.[mealType] || [];
                const isEmpty = items.length === 0;
                
                // Find tab config for dynamic border color
                const mealConfig = MEAL_TABS.find(t => t.id === mealType);
                const gradientClass = mealConfig ? mealConfig.color : 'from-gray-400 to-gray-500';

                return (
                  <div key={mealType} className="p-4 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Vertical Color Indicator */}
                      <div className={`w-1 h-4 rounded-full bg-gradient-to-b ${gradientClass}`}></div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{mealType}</h4>
                    </div>
                    
                    {isEmpty ? (
                      <p className="text-xs text-slate-300 italic pl-4">Nothing logged</p>
                    ) : (
                      <ul className="space-y-2 pl-4">
                        {items.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-center text-sm group-hover:scale-[1.01] transition-transform origin-left">
                            <span className="font-bold text-slate-700">{item.foodItem?.name}</span>
                            <span className="text-xs font-bold bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-500 shadow-sm">
                              {item.calories}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LogIntake;