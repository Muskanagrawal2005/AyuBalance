import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, Outlet } from 'react-router-dom';

const DietitianDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-800 text-white flex-shrink-0">
        <div className="p-6 font-bold text-xl">AyurCare Admin</div>
        <nav className="mt-6">
          <Link to="/dashboard" className="block px-6 py-3 hover:bg-emerald-700">Overview</Link>
          <Link to="/dashboard/patients" className="block px-6 py-3 hover:bg-emerald-700">My Patients</Link>
          <Link to="/dashboard/food-database" className="block px-6 py-3 hover:bg-emerald-700">Food Database</Link>
          <Link to="/dashboard/appointments" className="block px-6 py-3 hover:bg-emerald-700">Appointments</Link>
          <button onClick={logout} className="w-full text-left px-6 py-3 hover:bg-red-600 mt-auto">Logout</button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome, {user?.name}</h2>
          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">Dietitian</span>
        </header>
        
        {/* Render child pages here */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default DietitianDashboard;