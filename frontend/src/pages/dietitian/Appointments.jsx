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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Appointment Schedule</h1>

      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-gray-900">{new Date(appt.date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">{appt.slotTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{appt.patient?.name}</div>
                    {/* <div className="text-xs text-gray-500">{appt.patient?.mobile || 'No Mobile'}</div> */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appt.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments.length === 0 && (
            <div className="p-8 text-center text-gray-500">No appointments scheduled yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Appointments;