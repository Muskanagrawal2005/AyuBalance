import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import CreatePlanModal from '../../components/forms/CreatePlanModal';
import NutrientChart from '../../components/charts/NutrientChart';
import { useNavigate } from 'react-router-dom'; // Add useNavigate
import EditPatientModal from '../../components/forms/EditPatientModal';

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const navigate = useNavigate(); // Hook for redirection
  const [showEditModal, setShowEditModal] = useState(false);

  // NEW STATE: For Intake Logs
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyLog, setDailyLog] = useState(null);

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

  // NEW FUNCTION: Fetch Log when date changes
  const fetchIntakeLog = async () => {
    try {
      const { data } = await api.get(`/dietitian/patients/${id}/logs?date=${logDate}`);
      setDailyLog(data);
    } catch (error) {
      console.error("Error fetching log");
    }
  };

  useEffect(() => {
    if (id) {
      fetchPatientData();
      fetchIntakeLog(); // Fetch logs initially
    }
  }, [id]);

  // Re-fetch log when the date picker changes
  useEffect(() => {
    if (id) fetchIntakeLog();
  }, [logDate]);

  const fetchAnalysis = async () => {
    // Simple range: Last 30 days
    const end = new Date().toISOString().split('T')[0];
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    try {
      const { data } = await api.get(`/dietitian/patients/${id}/analysis?from=${start}&to=${end}`);
      setAnalysisData(data);
    } catch (error) {
      console.error("Analysis failed");
    }
  };

  // Add fetchAnalysis() to your initial useEffect
  useEffect(() => {
    if (id) {
      fetchPatientData();
      fetchIntakeLog();
      fetchAnalysis(); // <--- CALL IT HERE
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this patient? This action cannot be undone.")) {
      try {
        await api.delete(`/dietitian/patients/${id}`);
        alert("Patient deleted.");
        navigate('/dashboard/patients'); // Go back to list
      } catch (error) {
        alert("Failed to delete patient.");
      }
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm("Delete this diet plan? The patient will no longer see it.")) {
      try {
        await api.delete(`/dietitian/diet-plans/${planId}`);
        // Remove from UI immediately without refreshing
        setPlans(plans.filter(p => p._id !== planId));
      } catch (error) {
        alert("Failed to delete plan");
      }
    }
  };

  if (!patient) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-6">
      <header className="mb-8 border-b pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{patient.name}</h1>
          <div className="text-gray-600 mt-2 flex gap-4 text-sm">
            <span>Email: {patient.email}</span>
            <span>Dosha: {patient.ayurvedicDosha || 'N/A'}</span>
            <span>Age: {patient.age}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Analysis Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">30-Day Nutrient Analysis</h2>
          {analysisData ? (
            <NutrientChart analysis={analysisData} />
          ) : (
            <p>Loading analytics...</p>
          )}
        </div>

        {/* LEFT COLUMN: Diet Plans (Existing) */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-emerald-800">Assigned Diet Plans</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700"
            >
              + Create Plan
            </button>
          </div>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {plans.map((plan) => (
              <div key={plan._id} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="font-bold border-b pb-1 mb-2 flex justify-between">
                  <span>{plan.name}</span>
                  <span className="text-xs text-gray-400 font-normal">{new Date(plan.createdAt).toLocaleDateString()}</span>
                </div>

                <button
                  onClick={() => handleDeletePlan(plan._id)}
                  className="text-red-400 hover:text-red-600 px-2 py-1 text-xs border border-transparent hover:border-red-200 rounded"
                  title="Delete Plan"
                >
                  🗑️ Delete
                </button>

                <div className="text-xs text-gray-600">
                  {plan.meals.map(m => (
                    <div key={m.mealType}>
                      <span className="uppercase font-semibold">{m.mealType}: </span>
                      {m.items.map(i => i.foodItem?.name).join(', ')}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {plans.length === 0 && <p className="text-gray-400">No plans yet.</p>}
          </div>
        </section>

        {/* RIGHT COLUMN: Daily Intake Log (NEW) */}
        <section className="bg-gray-50 p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-blue-800">Daily Intake Log</h2>
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="border p-1 rounded text-sm"
            />
          </div>

          <div className="bg-white p-4 rounded shadow-sm">
            <div className="mb-4 text-center">
              <span className="text-gray-500 text-sm">Total Calories Logged</span>
              <div className="text-2xl font-bold text-blue-600">{dailyLog?.totalCalories || 0} kcal</div>
            </div>

            {/* Meals List */}
            {dailyLog && ['breakfast', 'lunch', 'dinner', 'snack'].map(meal => (
              <div key={meal} className="mb-4 border-b pb-2">
                <h3 className="font-bold uppercase text-xs text-gray-400 mb-2">{meal}</h3>
                {dailyLog.meals[meal].length === 0 ? (
                  <span className="text-xs text-gray-300 italic">No entry</span>
                ) : (
                  <ul className="space-y-1">
                    {dailyLog.meals[meal].map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span>{item.foodItem?.name || 'Unknown Food'}</span>
                        <span className="text-gray-500 font-mono">{item.calories}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>

      {showModal && (
        <CreatePlanModal
          patientId={id}
          onClose={() => setShowModal(false)}
          onSuccess={fetchPatientData}
        />
      )}

      {showEditModal && (
        <EditPatientModal
          patient={patient}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchPatientData}
        />
      )}
    </div>
  );
};

export default PatientDetails;