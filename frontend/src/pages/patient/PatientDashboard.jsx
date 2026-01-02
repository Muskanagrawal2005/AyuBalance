import React, { useState, useEffect } from "react";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import NutrientChart from "../../components/charts/NutrientChart";
import ChangePasswordModal from "../../components/forms/ChangePasswordModal";

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const [appointments, setAppointments] = useState([]);

  // Modal States
  const [showSettings, setShowSettings] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);

  // --- INTERACTIVITY STATE ---
  const [waterIntake, setWaterIntake] = useState(0);
  const [mood, setMood] = useState(null);

  // --- STREAK LOGIC STATE ---
  const [streakData, setStreakData] = useState({ count: 0, lastCheckIn: null });
  const [checkedInToday, setCheckedInToday] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: plansData } = await api.get("/patient/my-plans");
        setPlans(plansData);

        const end = new Date().toISOString().split("T")[0];
        const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
        const { data: analysis } = await api.get(
          `/patient/analysis?from=${start}&to=${end}`
        );
        setAnalysisData(analysis);

        const { data: apptData } = await api.get("/patient/appointments");
        setAppointments(apptData);
      } catch (error) {
        console.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // --- UPDATED STREAK & HYDRATION LOAD LOGIC ---
    if (user && user._id) {
      // 1. Load Streak (Unique to User ID)
      const streakKey = `streak_${user._id}`;
      const storedStreak = JSON.parse(localStorage.getItem(streakKey)) || {
        count: 0,
        lastCheckIn: null,
      };
      setStreakData(storedStreak);

      const today = new Date().toDateString();
      if (storedStreak.lastCheckIn === today) {
        setCheckedInToday(true);
      }

      // 2. Load Hydration (Unique to User ID + Today's Date)
      const hydrationKey = `hydration_${user._id}_${today}`;
      const savedHydration = localStorage.getItem(hydrationKey);

      if (savedHydration) {
        setWaterIntake(parseInt(savedHydration));
      } else {
        setWaterIntake(0); // Reset for new day or new user
      }
    }
  }, [user]); // Added user dependency

  // --- STREAK FUNCTIONALITY ---
  const handleCheckIn = () => {
    const today = new Date().toDateString();
    if (streakData.lastCheckIn === today) return; // Already done

    const newCount = streakData.count + 1;
    const newStreakData = { count: newCount, lastCheckIn: today };

    setStreakData(newStreakData);
    setCheckedInToday(true);

    // Save with User ID key
    if (user && user._id) {
      localStorage.setItem(`streak_${user._id}`, JSON.stringify(newStreakData));
    }

    alert(`🔥 Streak Increased! You are on a ${newCount} day streak.`);
  };

  // --- HYDRATION HELPER ---
  const updateWaterIntake = (newAmount) => {
    const validAmount = Math.max(0, Math.min(8, newAmount));
    setWaterIntake(validAmount);

    // Save to LocalStorage with Date & User Key
    if (user && user._id) {
      const today = new Date().toDateString();
      const hydrationKey = `hydration_${user._id}_${today}`;
      localStorage.setItem(hydrationKey, validAmount.toString());
    }
  };

  const nextAppt = appointments
    .filter((a) => new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  const getMealIcon = (type) => {
    if (type.includes("breakfast")) return "🌅";
    if (type.includes("lunch")) return "🌞";
    if (type.includes("dinner")) return "🌙";
    return "🍎";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 relative overflow-x-hidden">
      {/* --- 1. COLORFUL NAVBAR --- */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">
              AyurCare
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Interactive Streak Button */}
            <button
              onClick={() => setShowStreakModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full border border-orange-200 hover:scale-105 transition-transform cursor-pointer"
            >
              <span className="text-xl">🔥</span>
              <span className="font-bold text-orange-700">
                {streakData.count} Days
              </span>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
              title="Account Settings"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* --- 2. VIBRANT HERO --- */}
      <div className="relative bg-indigo-900 pt-16 pb-32 px-6 rounded-b-[4rem] shadow-2xl overflow-hidden">
        {/* Colorful Gradient Orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 text-xs font-bold uppercase tracking-widest shadow-lg">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
              Active Dashboard
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-xl">
              Hi, {user?.name.split(" ")[0]}{" "}
              <span className="text-4xl">👋</span>
            </h1>
            <p className="text-indigo-100 text-lg max-w-xl font-medium leading-relaxed">
              Let's keep your momentum going! You are doing great today.
            </p>
          </div>

          <div
            className="flex gap-4 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <Link
              to="/patient/log-intake"
              className="group relative px-8 py-4 bg-white text-indigo-900 rounded-2xl font-bold shadow-xl overflow-hidden transition-transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center gap-2 text-lg">
                <span>🍽️</span> Log Meal
              </span>
            </Link>
            <Link
              to="/patient/book-appointment"
              className="px-8 py-4 bg-indigo-600/50 backdrop-blur-md border border-indigo-400/50 text-white rounded-2xl font-bold hover:bg-indigo-600/70 transition-all hover:-translate-y-1 shadow-lg"
            >
              <span>📅</span> Book Visit
            </Link>
          </div>
        </div>
      </div>

      {/* --- 3. MAIN DASHBOARD GRID --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">
        {/* --- LEFT COLUMN (8 cols) --- */}
        <div className="lg:col-span-8 space-y-8">
          {/* TODAY'S MENU CARD */}
          <section
            className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white/50 animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-800">
                  Today's Menu
                </h2>
                <p className="text-slate-500 font-medium">
                  Your personalized fuel plan.
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">
                {plans.length > 0 ? "Active Plan" : "No Plan"}
              </span>
            </div>

            {loading ? (
              <div className="animate-pulse h-40 bg-slate-100 rounded-3xl"></div>
            ) : plans.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">No Plan Assigned</p>
              </div>
            ) : (
              <div className="space-y-6">
                {plans.map((plan) => (
                  <div key={plan._id}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {plan.meals.map((meal, idx) => (
                        <div
                          key={idx}
                          className="relative bg-gradient-to-br from-white to-slate-50 border border-slate-100 p-6 rounded-[2rem] hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-50">
                              {getMealIcon(meal.mealType)}
                            </div>
                            <h4 className="font-bold text-sm uppercase text-slate-500 tracking-widest">
                              {meal.mealType}
                            </h4>
                          </div>
                          <ul className="space-y-3">
                            {meal.items.map((item, i) => (
                              <li
                                key={i}
                                className="flex justify-between items-center text-sm"
                              >
                                <span className="font-bold text-slate-700">
                                  {item.foodItem?.name || "Item"}
                                </span>
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                                  {item.quantity} {item.unit}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* NUTRITION CHART */}
          <section
            className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-slate-100 animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-violet-100 text-violet-600 rounded-2xl">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-slate-800">
                  Nutrition Trends
                </h2>
              </div>
            </div>
            <div className="h-80 w-full bg-slate-50 rounded-3xl p-4 border border-slate-100">
              {analysisData ? (
                <NutrientChart analysis={analysisData} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <span className="text-4xl mb-2 grayscale opacity-50">📊</span>
                  <span>Log meals to see data</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* --- RIGHT COLUMN (4 cols) --- */}
        <div className="lg:col-span-4 space-y-8">
          {/* 🌊 HYDRATION WIDGET (Interactive) */}
          <div
            className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-cyan-500/20 relative overflow-hidden animate-slide-up transform transition hover:scale-[1.02]"
            style={{ animationDelay: "400ms" }}
          >
            {/* Fluid Background */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white/10 backdrop-blur-sm rounded-t-[100%] scale-150 animate-pulse"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold opacity-90">Hydration</h3>
                  <p className="text-cyan-100 text-xs font-medium">
                    Goal: 8 Cups
                  </p>
                </div>
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  💧
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-6xl font-black">{waterIntake}</span>
                <span className="text-xl font-medium opacity-70">/ 8</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateWaterIntake(waterIntake - 1)}
                  className="py-3 rounded-xl bg-black/20 hover:bg-black/30 font-bold transition-colors"
                >
                  - Remove
                </button>
                <button
                  onClick={() => updateWaterIntake(waterIntake + 1)}
                  className="py-3 rounded-xl bg-white text-blue-600 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  + Drink
                </button>
              </div>
            </div>
          </div>

          {/* ⚡ MOOD CHECK-IN (Interactive) */}
          <div
            className="bg-white rounded-[2rem] p-6 shadow-lg border border-slate-100 animate-slide-up"
            style={{ animationDelay: "500ms" }}
          >
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              How do you feel?
            </h3>
            <div className="flex justify-between gap-2">
              {[
                { label: "Great", emoji: "⚡", color: "bg-yellow-400" },
                { label: "Okay", emoji: "🍵", color: "bg-emerald-400" },
                { label: "Tired", emoji: "💤", color: "bg-slate-400" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setMood(item.label)}
                  className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-1 transition-all duration-300 ${
                    mood === item.label
                      ? `${item.color} text-white scale-110 shadow-lg`
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-xs font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 🎟️ NEXT APPOINTMENT */}
          <div
            className="group relative animate-slide-up"
            style={{ animationDelay: "600ms" }}
          >
            <div className="relative bg-white rounded-[2rem] shadow-lg overflow-hidden border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
              {/* Top Section */}
              <div className="bg-slate-900 p-6 text-white relative">
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full"></div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Next Visit
                  </span>
                  <span className="bg-slate-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white">
                    Confirmed
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold">Consultation</h3>
                <p className="text-slate-400 text-sm">
                  Dr. {nextAppt?.dietitian?.name || "AyurCare"}
                </p>
              </div>

              {/* Bottom Section */}
              <div className="p-6 pt-8 bg-white">
                {nextAppt ? (
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-4xl font-black text-slate-800 leading-none mb-1">
                        {new Date(nextAppt.date).getDate()}
                      </p>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        {new Date(nextAppt.date).toLocaleString("default", {
                          month: "long",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-indigo-600">
                        {nextAppt.slotTime}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <Link
                      to="/patient/book-appointment"
                      className="text-indigo-600 text-sm font-bold hover:underline"
                    >
                      Schedule Now &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS SECTION (Correctly placed at the root) --- */}

      {/* 1. Streak Modal */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-orange-100 to-transparent -z-10"></div>
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">
              🔥
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">
              {streakData.count} Day Streak!
            </h2>
            <p className="text-slate-500 mb-8">
              Consistency is the key to Ayurvedic balance. Keep it up!
            </p>
            <button
              onClick={handleCheckIn}
              disabled={checkedInToday}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                checkedInToday
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:scale-105 hover:shadow-orange-500/30"
              }`}
            >
              {checkedInToday ? "Checked In for Today ✅" : "Check In Now"}
            </button>
            <button
              onClick={() => setShowStreakModal(false)}
              className="mt-4 text-slate-400 font-bold text-sm hover:text-slate-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 2. Settings / Change Password Modal */}
      {showSettings && (
        <ChangePasswordModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default PatientDashboard;
