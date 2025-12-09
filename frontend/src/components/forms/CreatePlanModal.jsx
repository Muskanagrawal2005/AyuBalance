import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import api from "../../api/axiosInstance";

const CreatePlanModal = ({ patientId, onClose, onSuccess }) => {
  const [availableFoods, setAvailableFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // NEW: Search state
  const [selectedMealType, setSelectedMealType] = useState("breakfast");

  // Fetch foods
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data } = await api.get("/food");
        setAvailableFoods(data);
      } catch (e) {
        console.error("Failed to load foods");
      }
    };
    fetchFoods();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "Weekly Wellness Plan",
      instructions: "",
      meals: [],
    },
    onSubmit: async (values) => {
      try {
        await api.post(`/dietitian/patients/${patientId}/diet-plans`, values);
        onSuccess();
        onClose();
      } catch (error) {
        alert("Failed to save plan");
      }
    },
  });

  // --- LOGIC HELPERS ---

  const addFoodToMeal = (foodId, foodName) => {
    const newMealItem = {
      mealType: selectedMealType,
      items: [{ foodItem: foodId, quantity: 1, unit: "serving" }],
    };

    // Check if meal category exists
    const existingMealIndex = formik.values.meals.findIndex(
      (m) => m.mealType === selectedMealType
    );

    if (existingMealIndex > -1) {
      const updatedMeals = [...formik.values.meals];
      // Check if food already in that meal to prevent duplicates (Optional UX improvement)
      const existingItemIndex = updatedMeals[existingMealIndex].items.findIndex(
        (i) => i.foodItem === foodId
      );

      if (existingItemIndex > -1) {
        // Increment qty if exists
        updatedMeals[existingMealIndex].items[existingItemIndex].quantity += 1;
      } else {
        // Add new item
        updatedMeals[existingMealIndex].items.push({
          foodItem: foodId,
          quantity: 1,
          unit: "serving",
        });
      }
      formik.setFieldValue("meals", updatedMeals);
    } else {
      formik.setFieldValue("meals", [...formik.values.meals, newMealItem]);
    }
  };

  const removeFoodFromMeal = (mealIndex, itemIndex) => {
    const updatedMeals = [...formik.values.meals];
    updatedMeals[mealIndex].items.splice(itemIndex, 1);

    // If meal category empty, remove it
    if (updatedMeals[mealIndex].items.length === 0) {
      updatedMeals.splice(mealIndex, 1);
    }

    formik.setFieldValue("meals", updatedMeals);
  };

  const updateQuantity = (mealIndex, itemIndex, newQty) => {
    const updatedMeals = [...formik.values.meals];
    updatedMeals[mealIndex].items[itemIndex].quantity = newQty;
    formik.setFieldValue("meals", updatedMeals);
  };

  // Filter foods based on search
  const filteredFoods = availableFoods.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-primary-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-earth-50 rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden border border-earth-200">
        {/* --- HEADER --- */}
        <div className="bg-white px-8 py-5 border-b border-earth-200 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary-900">
              Create Prescription
            </h2>
            <p className="text-earth-500 text-sm">
              Select ingredients to build a balanced meal plan.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-earth-600 hover:bg-earth-100 rounded-xl font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={formik.handleSubmit}
              className="px-6 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-bold shadow-lg shadow-primary-900/20 transition-all hover:-translate-y-0.5"
            >
              Save Diet Plan
            </button>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT: THE PANTRY (Search & Select) */}
          <div className="w-1/3 bg-white border-r border-earth-200 flex flex-col">
            {/* Search Bar */}
            <div className="p-4 border-b border-earth-100">
              <div className="relative">
                <svg
                  className="absolute left-3 top-3.5 w-5 h-5 text-earth-400"
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
                <input
                  type="text"
                  placeholder="Search pantry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-earth-50 border border-earth-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Meal Type Selector (Sticky) */}
            <div className="p-4 bg-earth-50 border-b border-earth-200">
              <label className="block text-xs font-bold text-earth-500 uppercase tracking-wider mb-2">
                Adding to:
              </label>
              <select
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className="w-full p-3 border border-earth-200 rounded-xl bg-white font-bold text-primary-900 focus:ring-2 focus:ring-primary-100 outline-none cursor-pointer"
              >
                <option value="breakfast">☀️ Breakfast</option>
                <option value="lunch">🌞 Lunch</option>
                <option value="dinner">🌙 Dinner</option>
                <option value="snack">🍎 Snack</option>
              </select>
            </div>

            {/* Food List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredFoods.map((food) => (
                <div
                  key={food._id}
                  onClick={() => addFoodToMeal(food._id, food.name)}
                  className="group p-3 border border-earth-100 rounded-xl cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-all flex justify-between items-center bg-white shadow-sm"
                >
                  <div>
                    <h4 className="font-bold text-earth-800 group-hover:text-primary-900">
                      {food.name}
                    </h4>
                    <span className="text-xs text-earth-400 font-medium">
                      {food.calories} kcal • {food.virya}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-earth-100 flex items-center justify-center text-earth-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
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
                  </div>
                </div>
              ))}
              {filteredFoods.length === 0 && (
                <div className="text-center py-10 text-earth-400">
                  No foods found.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: THE PRESCRIPTION (Builder) */}
          <div className="w-2/3 bg-earth-50/50 flex flex-col overflow-y-auto">
            <div className="p-8 max-w-3xl mx-auto w-full">
              {/* Plan Name Input */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-earth-900 mb-2">
                  Plan Title
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("name")}
                  className="w-full text-2xl font-serif font-bold bg-transparent border-b-2 border-earth-200 py-2 focus:border-primary-500 outline-none placeholder-earth-300 text-primary-900"
                  placeholder="e.g. Week 1: Vata Balancing"
                />
              </div>

              {/* Empty State */}
              {formik.values.meals.length === 0 && (
                <div className="border-2 border-dashed border-earth-300 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-4 text-earth-400">
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-earth-600">
                    Your plan is empty
                  </h3>
                  <p className="text-earth-400">
                    Select items from the pantry on the left to start building.
                  </p>
                </div>
              )}

              {/* Meal Sections */}
              <div className="space-y-6">
                {formik.values.meals.map((meal, mealIndex) => (
                  <div
                    key={mealIndex}
                    className="bg-white rounded-2xl shadow-sm border border-earth-200 overflow-hidden"
                  >
                    <div className="bg-primary-50 px-6 py-3 border-b border-primary-100 flex justify-between items-center">
                      <h3 className="font-serif font-bold text-primary-800 uppercase tracking-wider">
                        {meal.mealType}
                      </h3>
                      <span className="text-xs font-bold text-primary-400">
                        {meal.items.length} items
                      </span>
                    </div>

                    <div className="divide-y divide-earth-50">
                      {meal.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="px-6 py-4 flex items-center justify-between group hover:bg-earth-50/50 transition-colors"
                        >
                          <div className="flex-1">
                            <span className="font-bold text-earth-800 block">
                              {availableFoods.find(
                                (f) => f._id === item.foodItem
                              )?.name || "Loading..."}
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center bg-earth-100 rounded-lg p-1">
                              <input
                                type="number"
                                min="1"
                                className="w-12 text-center bg-transparent font-bold text-earth-700 outline-none text-sm"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateQuantity(
                                    mealIndex,
                                    itemIndex,
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                              <span className="text-xs text-earth-500 pr-2">
                                srv
                              </span>
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={() =>
                                removeFoodFromMeal(mealIndex, itemIndex)
                              }
                              className="text-earth-300 hover:text-red-500 transition-colors p-1"
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes Section */}
              <div className="mt-8">
                <label className="block text-sm font-bold text-earth-900 mb-2">
                  Doctor's Notes & Instructions
                </label>
                <textarea
                  {...formik.getFieldProps("instructions")}
                  className="w-full border border-earth-200 rounded-2xl p-4 bg-white focus:ring-2 focus:ring-primary-100 outline-none min-h-[100px]"
                  placeholder="e.g. Drink warm water before meals. Avoid cold foods..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlanModal;
