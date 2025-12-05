import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { Link } from "react-router-dom"
import NutrientChart from '../../components/charts/NutrientChart'; // Import Chart

const PatientDashboard = () => {
    const { user, logout } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analysisData, setAnalysisData] = useState(null);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Plans
                const { data: plansData } = await api.get('/patient/my-plans');
                setPlans(plansData);

                // 2. Fetch Analysis (Last 30 days)
                const end = new Date().toISOString().split('T')[0];
                const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                const { data: analysis } = await api.get(`/patient/analysis?from=${start}&to=${end}`);
                setAnalysisData(analysis);
                // ... inside fetchData function ...
                // 3. Fetch Appointments (NEW)
                const { data: apptData } = await api.get('/patient/appointments');
                setAppointments(apptData);

            } catch (error) {
                console.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* 1. Navbar */}
            <nav className="bg-emerald-600 text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold">AyurCare Patient</h1>
                <div className="flex items-center gap-4">
                    <span className="font-medium">Welcome, {user?.name}</span>
                    <button
                        onClick={logout}
                        className="bg-emerald-800 px-4 py-2 rounded text-sm hover:bg-emerald-900 transition"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* ... inside main ... */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Health Dashboard</h2>

            {/* NEW: Upcoming Appointments Section */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-emerald-700">My Appointments</h3>
                    <Link
                        to="/patient/book-appointment"
                        className="bg-emerald-600 text-white px-4 py-2 rounded shadow hover:bg-emerald-700 transition flex items-center gap-2"
                    >
                        <span>📅</span> Book Appointment
                    </Link>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {appointments.map(appt => (
                        <div key={appt._id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-gray-800">
                                    {new Date(appt.date).toLocaleDateString()} at {appt.slotTime}
                                </p>
                                <p className="text-sm text-gray-600">Dr. {appt.dietitian?.name}</p>
                                <span className={`text-xs px-2 py-1 rounded ${appt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {appt.status}
                                </span>
                            </div>
                            {appt.status === 'confirmed' && (
                                <span className="text-xs font-bold text-emerald-600 border border-emerald-200 px-2 py-1 rounded">PAID</span>
                            )}
                        </div>
                    ))}

                    {appointments.length === 0 && (
                        <div className="bg-white p-6 rounded shadow text-center">
                            <p className="text-gray-500 mb-2">No upcoming appointments.</p>
                            <Link to="/patient/book-appointment" className="text-emerald-600 font-bold hover:underline">
                                Book One Now &rarr;
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* NEW: Charts Section */}
            <div className="mb-10">
                <h3 className="text-lg font-semibold text-emerald-700 mb-4">30-Day Nutrition Summary</h3>
                {analysisData ? (
                    <NutrientChart analysis={analysisData} />
                ) : (
                    <p className="text-gray-500">Log meals to see your analysis.</p>
                )}
            </div>


            {/* 2. Main Content */}
            <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Diet Plans</h2>

                {loading ? (
                    <p className="text-gray-600">Loading your health plan...</p>
                ) : (
                    <div className="space-y-6">
                        {/* Loop through plans */}
                        {plans.map((plan) => (
                            <div key={plan._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
                                <div className="flex justify-between items-center border-b pb-4 mb-4">
                                    <h3 className="text-xl font-bold text-emerald-900">{plan.name}</h3>
                                    <span className="text-sm text-gray-500">
                                        Assigned: {new Date(plan.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Display Meals */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {plan.meals.map((meal, idx) => (
                                        <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-bold uppercase text-emerald-700 mb-2 border-b pb-1">
                                                {meal.mealType}
                                            </h4>
                                            <ul className="list-disc pl-5 space-y-1">
                                                {meal.items.map((item, i) => (
                                                    <li key={i} className="text-gray-700">
                                                        <span className="font-medium">{item.foodItem?.name || 'Unknown Item'}</span>
                                                        <span className="text-xs text-gray-500 ml-1">
                                                            ({item.quantity} {item.unit})
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                                {/* Instructions */}
                                {plan.instructions && (
                                    <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded text-sm border border-yellow-100">
                                        <strong>Doctor's Note:</strong> {plan.instructions}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Empty State */}
                        {plans.length === 0 && (
                            <div className="text-center py-12 bg-white rounded shadow">
                                <p className="text-gray-500 text-lg">No diet plans assigned yet.</p>
                                <p className="text-sm text-gray-400">Your dietitian will upload one soon.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Link to="/patient/log-intake" className="bg-white text-emerald-800 px-4 py-2 rounded font-bold hover:bg-gray-100">
                📝 Log Daily Food
            </Link>
        </div>
    );
};

export default PatientDashboard;