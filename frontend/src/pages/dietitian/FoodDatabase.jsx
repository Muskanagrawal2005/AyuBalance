import React, { useState, useEffect } from "react";
import api from "../../api/axiosInstance";
import AddFoodModal from "../../components/forms/AddFoodModal";

const FoodDatabase = () => {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Search logic (Preserved)
  const fetchFoods = async () => {
    try {
      const { data } = await api.get(`/food?search=${search}`);
      setFoods(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchFoods();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Helper for Virya (Potency) styling
  const getViryaStyle = (virya) => {
    if (virya === "Heating")
      return "bg-orange-50 text-orange-700 border-orange-100";
    if (virya === "Cooling") return "bg-cyan-50 text-cyan-700 border-cyan-100";
    return "bg-earth-50 text-earth-600 border-earth-100";
  };

  return (
    <div className="space-y-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary-900">
            Food Pantry
          </h1>
          <p className="text-earth-600">
            Browse ingredients and their Ayurvedic properties.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary-900/10 transition-all active:scale-95"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="font-semibold">Add Ingredient</span>
        </button>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="relative max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-earth-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search ingredients (e.g. Mung Dal, Ginger, Milk)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-4 bg-white border border-earth-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all placeholder-earth-300 text-earth-800"
        />
      </div>

      {/* --- GRID LAYOUT --- */}
      {loading ? (
        <div className="text-center py-20 text-earth-400 animate-pulse">
          Loading pantry...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods.map((food) => (
            <div
              key={food._id}
              className="bg-primary-100 rounded-2xl border-2 border-primary-100 shadow-md hover:shadow-lg hover:border-primary-200 transition-all duration-300 group overflow-hidden flex flex-col"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-earth-50 bg-earth-50/30">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-serif font-bold text-lg text-primary-900 leading-tight group-hover:text-primary-700 transition-colors">
                    {food.name}
                  </h3>
                  <span className="shrink-0 ml-2 px-2 py-1 bg-white border border-earth-200 rounded-md text-xs font-bold text-earth-600 shadow-sm">
                    {food.calories} kcal
                  </span>
                </div>
                <p className="text-xs text-earth-400 font-medium">
                  Per 100g serving
                </p>
              </div>

              {/* Macros Section */}
              <div className="px-5 py-4 grid grid-cols-3 gap-2 text-center bg-white">
                <div className="flex flex-col">
                  <span className="text-xs text-earth-400 uppercase tracking-wider font-semibold">
                    Prot
                  </span>
                  <span className="font-bold text-earth-700">
                    {food.protein_g}g
                  </span>
                </div>
                <div className="flex flex-col border-l border-earth-100">
                  <span className="text-xs text-earth-400 uppercase tracking-wider font-semibold">
                    Carb
                  </span>
                  <span className="font-bold text-earth-700">
                    {food.carbs_g}g
                  </span>
                </div>
                <div className="flex flex-col border-l border-earth-100">
                  <span className="text-xs text-earth-400 uppercase tracking-wider font-semibold">
                    Fat
                  </span>
                  <span className="font-bold text-earth-700">
                    {food.fat_g}g
                  </span>
                </div>
              </div>

              {/* Ayurvedic Footer */}
              <div className="mt-auto p-4 bg-earth-50/50 border-t border-earth-100 flex gap-2 flex-wrap">
                {/* Virya Badge */}
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getViryaStyle(
                    food.virya
                  )} flex items-center gap-1`}
                >
                  {food.virya === "Heating"
                    ? "🔥"
                    : food.virya === "Cooling"
                    ? "❄️"
                    : "⚖️"}
                  {food.virya || "Neutral"}
                </span>

                {/* Rasa Badge */}
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-100 flex items-center gap-1">
                  👅 {food.rasa || "Unknown"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && foods.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-earth-200">
          <div className="mx-auto w-16 h-16 bg-earth-50 rounded-full flex items-center justify-center mb-4 text-earth-300">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-earth-900">
            Pantry is empty
          </h3>
          <p className="mt-1 text-earth-500">
            Try searching for something else or add a new ingredient.
          </p>
        </div>
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
