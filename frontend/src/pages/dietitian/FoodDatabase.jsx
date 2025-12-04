import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import AddFoodModal from '../../components/forms/AddFoodModal';

const FoodDatabase = () => {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Search logic (debounced slightly via logic or plain effect)
  const fetchFoods = async () => {
    try {
      const { data } = await api.get(`/food?search=${search}`);
      setFoods(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Basic debounce to avoid too many API calls while typing
    const delayDebounce = setTimeout(() => {
      fetchFoods();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Food Database</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
        >
          + Add Food Item
        </button>
      </div>

      <input
        type="text"
        placeholder="Search for food (e.g. Mung Dal, Apple)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded mb-6 shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {foods.map((food) => (
          <div key={food._id} className="bg-white p-4 rounded shadow border hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-emerald-900">{food.name}</h3>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">{food.calories} kcal</span>
            </div>
            
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <p>P: {food.protein_g}g | C: {food.carbs_g}g | F: {food.fat_g}g</p>
              <div className="border-t pt-2 mt-2 flex gap-2">
                 <span className={`px-2 py-0.5 rounded text-xs ${food.virya === 'Heating' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                   {food.virya}
                 </span>
                 <span className="px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">
                   {food.rasa}
                 </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {foods.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No foods found. Add some to the database!</p>
      )}

      {showModal && (
        <AddFoodModal 
          onClose={() => setShowModal(false)} 
          onSuccess={fetchFoods} 
        />
      )}
    </div>
  );
};

export default FoodDatabase;