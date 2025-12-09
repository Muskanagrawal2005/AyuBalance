import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalFoods: 0,
    recentPatients: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, foodRes] = await Promise.all([
          api.get('/dietitian/patients'),
          api.get('/food')
        ]);

        setStats({
          totalPatients: patientsRes.data.length,
          totalFoods: foodRes.data.length,
          recentPatients: patientsRes.data.slice(0, 3) 
        });
      } catch (error) {
        console.error("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* --- 1. STATS ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Patients Stat */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-primary-100 flex items-center gap-5 hover:shadow-lg hover:border-primary-300 transition-all group">
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <div>
            <p className="text-earth-500 text-xs font-bold uppercase tracking-wider mb-1">Active Patients</p>
            <h3 className="text-4xl font-serif font-bold text-primary-900 leading-none">{loading ? '...' : stats.totalPatients}</h3>
          </div>
        </div>

        {/* Pantry Stat */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-orange-100 flex items-center gap-5 hover:shadow-lg hover:border-orange-300 transition-all group">
          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
          </div>
          <div>
            <p className="text-earth-500 text-xs font-bold uppercase tracking-wider mb-1">Pantry Items</p>
            <h3 className="text-4xl font-serif font-bold text-earth-800 leading-none">{loading ? '...' : stats.totalFoods}</h3>
          </div>
        </div>

        {/* Action Card */}
        <Link to="/dashboard/patients" className="bg-primary-800 p-6 rounded-3xl shadow-xl shadow-primary-900/20 border-4 border-primary-700 flex items-center justify-between group hover:bg-primary-900 transition-all cursor-pointer">
          <div>
            <p className="text-lime-200 text-xs font-bold uppercase tracking-wider mb-2">Quick Action</p>
            <h3 className="text-2xl font-serif font-bold text-white group-hover:translate-x-1 transition-transform">Add Patient &rarr;</h3>
          </div>
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20 group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- 2. RECENT PATIENTS LIST (Dark Green Container) --- */}
        <div className="lg:col-span-2 bg-primary-800 rounded-[2rem] p-8 shadow-xl border border-primary-700 relative overflow-hidden">
           {/* Background Decoration */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-700 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white">Recently Added</h2>
              <p className="text-primary-200 text-sm text-lime-200">Newest members of your clinic</p>
            </div>
            <Link to="/dashboard/patients" className="px-5 py-2 bg-white/10 text-white text-sm font-bold rounded-xl hover:bg-white hover:text-primary-900 transition-all backdrop-blur-sm">
              View All
            </Link>
          </div>

          <div className="space-y-4 relative z-10">
            {stats.recentPatients.length === 0 && !loading && (
              <div className="text-center py-10 border-2 border-dashed border-primary-600 rounded-2xl bg-primary-700/30">
                 <p className="text-primary-200 italic">No recent activity found.</p>
              </div>
            )}
            
            {stats.recentPatients.map(patient => (
              // White Row inside Green Container
              <div key={patient._id} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all group cursor-pointer border border-transparent hover:border-primary-200">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-earth-100 text-earth-600 font-bold text-lg flex items-center justify-center border-2 border-white shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-earth-900">{patient.name}</h4>
                    <p className="text-sm text-earth-500 font-medium">{patient.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <span className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                      patient.ayurvedicDosha === 'Vata' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                      patient.ayurvedicDosha === 'Pitta' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                      patient.ayurvedicDosha === 'Kapha' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      'bg-earth-50 text-earth-600 border-earth-100'
                   }`}>
                     {patient.ayurvedicDosha || 'N/A'}
                   </span>
                   <Link to={`/dashboard/patients/${patient._id}`} className="w-10 h-10 flex items-center justify-center rounded-full text-earth-400 hover:text-primary-700 hover:bg-primary-50 transition-all">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                   </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- 3. WISDOM CARD (Reverted to Light Gradient) --- */}
        <div className="bg-gradient-to-br from-earth-50 via-primary-50 to-orange-50 bg-[length:200%_200%] animate-gradient-slow rounded-[2rem] p-8 border-2 border-white/50 shadow-xl flex flex-col justify-center relative overflow-hidden min-h-[350px]">
          
          {/* Decorative Blur Orbs */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none mix-blend-multiply"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-200/40 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none mix-blend-multiply"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-primary-700">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-1.05.174v-4.102l2.166-.928a1 1 0 00-.787-1.838l-7 3a1 1 0 000 1.838l7 3a1 1 0 00.787-1.838l-2.167-.928v4.102c0 .442.286.828.706.955A11.048 11.048 0 0110 20c-2.4 0-4.62-.75-6.458-2.035.42-1.27.264-1.656.706-1.656v-4.102l2.167.928a1 1 0 00.787-1.838l-7-3a1 1 0 00-.787 1.838l2.167.928z"/></svg>
               <span className="font-black text-xs uppercase tracking-widest">Daily Wisdom</span>
            </div>
            
            <h3 className="text-3xl font-serif font-bold text-earth-900 mb-6 italic leading-snug drop-shadow-sm">
              "When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need."
            </h3>
            
            <div className="flex items-center gap-3">
               <div className="h-px w-12 bg-primary-300"></div>
               <p className="text-primary-800 text-sm font-bold uppercase tracking-wider">— Ayurvedic Proverb</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;