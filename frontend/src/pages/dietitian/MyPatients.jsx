import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import AddPatientModal from '../../components/forms/AddPatientModal';
import { Link } from 'react-router-dom';

const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to fetch patients
  const fetchPatients = async () => {
    try {
      const { data } = await api.get('/dietitian/patients');
      setPatients(data);
    } catch (error) {
      console.error("Failed to load patients", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Patients</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
        >
          + Add New Patient
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{patient.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{patient.ayurvedicDosha || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 hover:text-emerald-900">
  <Link to={`/dashboard/patients/${patient._id}`}>View Details</Link>
</td>
                </tr>
              ))}
            </tbody>
          </table>
          {patients.length === 0 && (
            <div className="p-4 text-center text-gray-500">No patients found. Add your first one!</div>
          )}
        </div>
      )}

      {showModal && (
        <AddPatientModal 
          onClose={() => setShowModal(false)} 
          onSuccess={fetchPatients} 
        />
      )}
    </div>
  );
};

export default MyPatients;