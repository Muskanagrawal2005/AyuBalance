import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppts = async () => {
      try {
        const { data } = await api.get('/dietitian/appointments');
        setAppointments(data);
      } catch (error) {
        console.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppts();
  }, []);

  // Vibrant Status Badges
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': 
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm';
      case 'pending': 
        return 'bg-amber-100 text-amber-800 border-amber-200 shadow-sm';
      case 'completed': 
        return 'bg-blue-100 text-blue-800 border-blue-200 shadow-sm';
      case 'cancelled': 
        return 'bg-red-100 text-red-800 border-red-200 shadow-sm';
      default: 
        return 'bg-earth-100 text-earth-600 border-earth-200';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* --- 1. ANIMATED HEADER CARD --- */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-serif font-bold mb-2">Appointment Schedule</h1>
          <p className="text-primary-200 font-medium">Manage your upcoming patient consultations.</p>
        </div>
        
        {/* Date Badge */}
        <div className="relative z-10 px-5 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center gap-3 shadow-lg">
           <div className="p-2 bg-white text-primary-900 rounded-lg">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
           </div>
           <div>
             <span className="block text-xs text-primary-200 font-bold uppercase tracking-wider">Today</span>
             <span className="font-bold text-white">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
           </div>
        </div>
      </div>

      {/* --- 2. SCHEDULE LIST --- */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-earth-100 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-20 text-center text-earth-400 animate-pulse font-medium">
            Loading your schedule...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-earth-100">
              <thead className="bg-earth-50/50">
                <tr>
                  <th className="px-8 py-6 text-left text-xs font-bold text-earth-400 uppercase tracking-widest">Time & Date</th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-earth-400 uppercase tracking-widest">Patient</th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-earth-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-left text-xs font-bold text-earth-400 uppercase tracking-widest">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-earth-50">
                {appointments.map((appt) => (
                  <tr 
                    key={appt._id} 
                    className="group hover:bg-primary-50/10 transition-all duration-200 hover:shadow-md cursor-default"
                  >
                    
                    {/* Date Column */}
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center w-14 h-14 bg-earth-50 rounded-2xl border border-earth-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                          <span className="text-xs font-bold text-earth-400 uppercase group-hover:text-primary-400">
                            {new Date(appt.date).toLocaleString('default', { month: 'short' })}
                          </span>
                          <span className="font-serif font-bold text-xl text-earth-800 group-hover:text-primary-800">
                            {new Date(appt.date).getDate()}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-lg border border-primary-100">
                          {appt.slotTime}
                        </div>
                      </div>
                    </td>

                    {/* Patient Column */}
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 text-purple-700 flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                          {appt.patient?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div className="text-lg font-bold text-earth-900 group-hover:text-primary-900 transition-colors">
                            {appt.patient?.name || 'Unknown Patient'}
                          </div>
                          {appt.patient?.mobile && (
                             <div className="text-xs text-earth-400 font-medium flex items-center gap-1">
                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                               {appt.patient.mobile}
                             </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`px-4 py-1.5 inline-flex text-xs leading-5 font-bold uppercase tracking-wider rounded-xl border ${getStatusStyle(appt.status)}`}>
                        {appt.status?.toUpperCase()}
                      </span>
                    </td>

                    {/* Notes Column */}
                    <td className="px-8 py-6 whitespace-normal max-w-xs">
                      {appt.notes ? (
                        <p className="text-sm text-earth-600 bg-earth-50 p-3 rounded-xl border border-earth-100 italic group-hover:bg-white group-hover:shadow-sm transition-all">
                          "{appt.notes}"
                        </p>
                      ) : (
                        <span className="text-xs text-earth-300 font-bold uppercase tracking-wider pl-2">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {appointments.length === 0 && (
              <div className="py-24 text-center flex flex-col items-center justify-center bg-earth-50/30">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 text-earth-300 shadow-sm border border-earth-100">
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-xl font-serif font-bold text-earth-900">No Appointments</h3>
                <p className="text-earth-500 mt-2 max-w-sm">Your schedule is currently clear. Enjoy the free time!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;