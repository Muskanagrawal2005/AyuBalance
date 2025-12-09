import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import CreatePlanModal from '../../components/forms/CreatePlanModal';
import EditPatientModal from '../../components/forms/EditPatientModal';
import NutrientChart from '../../components/charts/NutrientChart';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State
  const [patient, setPatient] = useState(null);
  const [plans, setPlans] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [dailyLog, setDailyLog] = useState(null);
  
  // Modals & Date
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);

  // --- DATA FETCHING ---
  const fetchPatientData = async () => {
    try {
      const { data } = await api.get(`/dietitian/patients/${id}`);
      setPatient(data);
      const { data: planData } = await api.get(`/dietitian/patients/${id}/diet-plans`);
      setPlans(planData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchIntakeLog = async () => {
    try {
      const { data } = await api.get(`/dietitian/patients/${id}/logs?date=${logDate}`);
      setDailyLog(data);
    } catch (error) {
      console.error("Error fetching log");
    }
  };

  const fetchAnalysis = async () => {
    const end = new Date().toISOString().split('T')[0];
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    try {
      const { data } = await api.get(`/dietitian/patients/${id}/analysis?from=${start}&to=${end}`);
      setAnalysisData(data);
    } catch (error) {
      console.error("Analysis failed");
    }
  };

  useEffect(() => {
    if (id) {
      fetchPatientData();
      fetchIntakeLog();
      fetchAnalysis();
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchIntakeLog();
  }, [logDate]);

  // --- ACTIONS ---
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this patient? This action cannot be undone.")) {
      try {
        await api.delete(`/dietitian/patients/${id}`);
        alert("Patient deleted.");
        navigate('/dashboard/patients');
      } catch (error) {
        alert("Failed to delete patient.");
      }
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm("Delete this diet plan? The patient will no longer see it.")) {
      try {
        await api.delete(`/dietitian/diet-plans/${planId}`);
        setPlans(plans.filter(p => p._id !== planId));
      } catch (error) {
        alert("Failed to delete plan");
      }
    }
  };

  const getDoshaStyle = (dosha) => {
    switch (dosha?.toLowerCase()) {
      case 'vata': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'pitta': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'kapha': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-earth-100 text-earth-800 border-earth-300';
    }
  };

  if (!patient) return <div className="p-12 text-center animate-pulse text-primary-600 font-bold">Loading Profile...</div>;

  return (
    // ROOT: Increased gap to gap-12 to force separation between major sections
    <div className="flex flex-col gap-12 pb-20 max-w-7xl mx-auto w-full">
      
      {/* --- SECTION 1: HEADER --- */}
      <header className="w-full bg-gradient-to-r from-primary-50 to-white rounded-3xl p-6 md:p-8 shadow-md border border-primary-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-between items-start">
          <div className="flex gap-6 items-center">
             <div className="w-24 h-24 rounded-2xl bg-white text-primary-800 flex items-center justify-center text-4xl font-serif font-bold shadow-lg border-2 border-primary-100">
               {patient.name.charAt(0).toUpperCase()}
             </div>
             <div>
               <h1 className="text-4xl font-serif font-bold text-primary-900 mb-2 leading-tight">{patient.name}</h1>
               <div className="flex flex-wrap gap-3 mb-3">
                 <span className={`px-4 py-1.5 rounded-lg text-sm font-bold border uppercase tracking-wider ${getDoshaStyle(patient.ayurvedicDosha)}`}>
                   {patient.ayurvedicDosha || 'N/A'} Dosha
                 </span>
                 <span className="px-4 py-1.5 rounded-lg text-sm font-bold bg-white text-earth-700 border border-earth-200">Age: {patient.age}</span>
               </div>
               <div className="flex items-center gap-2 text-earth-600 font-medium">{patient.email}</div>
             </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowEditModal(true)} className="px-5 py-2.5 bg-white border border-primary-200 text-primary-700 hover:bg-primary-50 rounded-xl text-sm font-bold transition-colors">Edit Profile</button>
            <button onClick={handleDelete} className="px-5 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-colors">Delete</button>
          </div>
        </div>
      </header>

      {/* --- SECTION 2: ANALYSIS ROW --- */}
      {/* Flex-col on mobile, Row on Large screens. */}
      <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
        
        {/* Nutrient Chart */}
        {/* CHANGED: Removed fixed height, added min-h-[400px] to prevent bleeding */}
        <div className="w-full lg:w-2/3 group bg-white rounded-3xl p-6 shadow-sm border border-earth-200 transition-all duration-300 hover:bg-primary-900 hover:border-primary-900 hover:shadow-xl hover:scale-[1.01]">
          <h2 className="text-lg font-serif font-bold text-primary-900 mb-4 group-hover:text-white transition-colors">Nutrient Balance</h2>
          
          <div className="w-full min-h-[400px] bg-white/50 rounded-xl p-2 transition-colors group-hover:bg-white/90">
             {analysisData ? (
               <NutrientChart analysis={analysisData} />
             ) : (
               <div className="h-full flex items-center justify-center text-earth-400 bg-earth-50 rounded-xl min-h-[300px]">Processing Intake Data...</div>
             )}
          </div>
        </div>

        {/* Ayurvedic Impact */}
        {/* CHANGED: min-h-[400px] to match chart height */}
        <div className="w-full lg:w-1/3 bg-primary-900 text-white rounded-3xl p-6 shadow-md border border-primary-800 flex flex-col relative overflow-hidden min-h-[400px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-800 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 flex-1">
            <h2 className="text-lg font-serif font-bold text-primary-100 mb-1">Ayurvedic Impact</h2>
            <p className="text-primary-300 text-xs mb-6">Based on recent food intake</p>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-orange-200">Pitta (Heat)</span>
                  <span className="text-white">High</span>
                </div>
                <div className="w-full bg-primary-800 rounded-full h-2">
                  <div className="bg-orange-400 h-2 rounded-full w-[75%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-purple-200">Vata (Air)</span>
                  <span className="text-white">Balanced</span>
                </div>
                <div className="w-full bg-primary-800 rounded-full h-2">
                  <div className="bg-purple-400 h-2 rounded-full w-[30%]"></div>
                </div>
              </div>

               <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-blue-200">Kapha (Earth)</span>
                  <span className="text-white">Low</span>
                </div>
                <div className="w-full bg-primary-800 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full w-[15%]"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-primary-800 relative z-10">
            <p className="text-xs text-primary-200 leading-relaxed">
              <strong className="text-white block mb-1">Recommendation:</strong>
              Reduce heating foods (Pungent/Sour) to pacify Pitta aggravation. Increase cooling hydration.
            </p>
          </div>
        </div>
      </div>

      {/* --- SECTION 3: MANAGEMENT ROW --- */}
      {/* This section will naturally flow BELOW section 2 because of the main flex-col gap-12 */}
      <div className="flex flex-col xl:flex-row gap-8 w-full items-start">
        
        {/* LEFT: Diet Plan History */}
        <div className="w-full xl:w-1/2 flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif font-bold text-earth-800">Assigned Plans</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-700 shadow-md transition-transform active:scale-95"
            >
              + Create Plan
            </button>
          </div>
          
          <div className="flex flex-col gap-5">
            {plans.map((plan) => (
              <div 
                key={plan._id} 
                className="group bg-white border border-earth-200 rounded-2xl p-6 shadow-sm transition-all duration-300
                           hover:bg-primary-900 hover:border-primary-900 hover:shadow-xl hover:scale-[1.01] cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-primary-900 group-hover:text-white transition-colors mb-1">
                      {plan.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-primary-50 text-primary-700 px-2 py-1 rounded transition-colors group-hover:bg-white/20 group-hover:text-white">
                        ACTIVE
                      </span>
                      <p className="text-xs text-earth-500 font-medium uppercase tracking-wide group-hover:text-primary-200 transition-colors">
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeletePlan(plan._id); }}
                    className="text-earth-300 p-2 rounded-lg transition-colors group-hover:text-white/70 group-hover:hover:text-white group-hover:hover:bg-white/10"
                    title="Delete Plan"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-earth-100 group-hover:border-primary-800 transition-colors">
                  {plan.meals.map(m => (
                    <div key={m.mealType}>
                      <span className="text-primary-600 text-xs font-black uppercase tracking-widest block mb-1 group-hover:text-primary-300 transition-colors">
                        {m.mealType}
                      </span>
                      <span className="text-earth-700 text-sm font-medium leading-relaxed block group-hover:text-primary-50 transition-colors">
                         {m.items.map(i => i.foodItem?.name).join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {plans.length === 0 && (
              <div className="p-10 text-center bg-white rounded-2xl border-2 border-dashed border-earth-200">
                <p className="text-earth-400 font-medium">No diet plans created yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Daily Journal */}
        <div className="w-full xl:w-1/2 group bg-earth-100 p-6 sm:p-8 rounded-3xl border border-earth-200 transition-all duration-300 hover:bg-primary-900 hover:border-primary-900 hover:shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-earth-900 flex items-center gap-2 group-hover:text-white transition-colors">
                <span>📖</span> Patient Journal
              </h2>
              <p className="text-earth-600 text-sm group-hover:text-primary-200 transition-colors">Review daily food intake logs.</p>
            </div>
            
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="bg-white border-2 border-earth-200 px-4 py-2 rounded-xl text-sm font-bold text-earth-700 outline-none focus:border-primary-400 shadow-sm"
            />
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-earth-100 relative overflow-hidden group-hover:bg-white/10 group-hover:border-primary-700 transition-colors">
            
            <div className="flex justify-between items-center pb-6 border-b-2 border-earth-50 mb-6 group-hover:border-white/10">
              <span className="text-earth-400 text-xs font-bold uppercase tracking-widest group-hover:text-primary-300">Total Intake</span>
              <div className="text-right">
                <span className="text-4xl font-serif font-bold text-primary-700 block leading-none group-hover:text-white">
                  {dailyLog?.totalCalories || 0}
                </span>
                <span className="text-xs text-earth-400 font-bold uppercase group-hover:text-primary-300">Calories</span>
              </div>
            </div>

            <div className="space-y-6">
              {dailyLog && ['breakfast', 'lunch', 'dinner', 'snack'].map(meal => (
                <div key={meal} className="relative">
                  <div className="absolute top-2 left-2.5 w-0.5 h-full bg-earth-100 -z-10 group-hover:bg-white/10"></div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary-100 border-2 border-white shadow-sm shrink-0 flex items-center justify-center mt-0.5 group-hover:bg-primary-800 group-hover:border-primary-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 group-hover:bg-primary-300"></div>
                    </div>
                    <div className="w-full">
                      <h3 className="text-xs font-bold text-earth-500 uppercase tracking-widest mb-2 group-hover:text-primary-200">{meal}</h3>
                      {!dailyLog.meals[meal] || dailyLog.meals[meal].length === 0 ? (
                        <div className="text-sm text-earth-300 italic bg-earth-50/50 p-2 rounded-lg group-hover:bg-white/5 group-hover:text-primary-200/50">No entry logged</div>
                      ) : (
                        <ul className="space-y-2">
                          {dailyLog.meals[meal].map((item, idx) => (
                            <li key={idx} className="flex justify-between items-center text-sm p-2 bg-earth-50 rounded-lg border border-earth-100 group-hover:bg-white/10 group-hover:border-transparent">
                              <span className="text-earth-800 font-bold group-hover:text-white">{item.foodItem?.name}</span>
                              <span className="text-primary-700 text-xs font-bold bg-white px-2 py-1 rounded shadow-sm group-hover:text-primary-900">{item.calories} kcal</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {showModal && <CreatePlanModal patientId={id} onClose={() => setShowModal(false)} onSuccess={fetchPatientData} />}
      {showEditModal && <EditPatientModal patient={patient} onClose={() => setShowEditModal(false)} onSuccess={fetchPatientData} />}
    </div>
  );
};

export default PatientDetails;