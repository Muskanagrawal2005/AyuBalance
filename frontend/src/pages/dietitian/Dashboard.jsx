import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, Outlet, useLocation } from "react-router-dom";

// Helper component for Navigation Links to handle "Active" styling
const NavItem = ({ to, label, icon }) => {
  const location = useLocation();
  // Check if the current URL matches this link
  const isActive =
    location.pathname === to ||
    (to !== "/dashboard" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-200 group ${
        isActive
          ? "bg-primary-800 text-white shadow-lg shadow-primary-900/20" // Active Style
          : "text-primary-100 hover:bg-primary-800/50 hover:text-white" // Inactive Style
      }`}
    >
      {/* Icon Wrapper */}
      <span
        className={`transition-colors ${
          isActive
            ? "text-primary-400"
            : "text-primary-300 group-hover:text-white"
        }`}
      >
        {icon}
      </span>
      <span className="font-medium tracking-wide">{label}</span>
    </Link>
  );
};

const DietitianDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-earth-50 font-sans text-earth-800">
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-primary-900 text-white flex-shrink-0 flex flex-col shadow-2xl relative overflow-hidden">
        {/* Decorative Circle for "Organic" feel */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-800 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {/* Logo Area */}
        <div className="p-8 pb-4 relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-inner">
              {/* Leaf Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold tracking-tight text-white">
                AyurCare
              </h1>
              <p className="text-xs text-primary-300 uppercase tracking-wider font-semibold">
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 px-2 relative z-10">
          <NavItem
            to="/dashboard"
            label="Overview"
            icon={
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
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            }
          />
          <NavItem
            to="/dashboard/patients"
            label="My Patients"
            icon={
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            }
          />
          <NavItem
            to="/dashboard/food-database"
            label="Food Database"
            icon={
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
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
            }
          />
          <NavItem
            to="/dashboard/appointments"
            label="Appointments"
            icon={
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
        </nav>

        {/* Logout Button */}
        <div className="p-4 relative z-10">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-900/30 hover:bg-red-800/50 text-red-200 hover:text-red-100 rounded-xl transition-all border border-red-900/50 group"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
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
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-auto h-screen relative">
        {/* Sticky Header */}
        <header className="sticky top-0 bg-earth-50/80 backdrop-blur-md z-20 px-8 py-6 flex justify-between items-center border-b border-earth-200">
          <div>
            <h2 className="text-3xl font-serif font-bold text-primary-900">
              Welcome back,{" "}
              <span className="text-primary-700">{user?.name}</span>
            </h2>
            <p className="text-earth-600 text-sm mt-1">
              Here is what's happening with your patients today.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell (Visual only) */}
            {/* <button className="p-2 text-earth-400 hover:text-primary-600 transition-colors relative">
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-earth-50"></span>
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button> */}

            {/* Profile Badge */}
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-earth-100">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                DR
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-earth-900 uppercase tracking-wide">
                  Dietitian
                </span>
                <span className="text-[10px] text-earth-500 leading-none">
                  Ayurveda Specialist
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 pb-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DietitianDashboard;
