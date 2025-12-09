import React, { useState, useEffect } from "react";
import api from "../../api/axiosInstance";
import AddPatientModal from "../../components/forms/AddPatientModal";
import { Link } from "react-router-dom";

const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to fetch patients (Logic unchanged)
  const fetchPatients = async () => {
    try {
      const { data } = await api.get("/dietitian/patients");
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

  // New Helper for Visual Styling (Dosha Badges)
  const getDoshaColor = (dosha) => {
    switch (dosha?.toLowerCase()) {
      case "vata":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "pitta":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "kapha":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-earth-100 text-earth-600 border-earth-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary-900">
            Patient Management
          </h1>
          <p className="text-earth-600">
            View and manage your patient records.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary-900/10 transition-all active:scale-95"
        >
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="font-semibold">Add New Patient</span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-earth-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-earth-500 animate-pulse">
            Loading patient records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-earth-100">
              <thead className="bg-earth-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-earth-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-earth-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-earth-500 uppercase tracking-wider">
                    Dosha Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-earth-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-earth-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-earth-100">
                {patients.map((patient) => (
                  <tr
                    key={patient._id}
                    className="hover:bg-primary-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-earth-200 flex items-center justify-center text-earth-600 font-bold border border-earth-300">
                          {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-earth-900">
                            {patient.name}
                          </div>
                          <div className="text-xs text-earth-500">
                            Age: {patient.age || "N/A"} •{" "}
                            {patient.gender || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-earth-700">
                        {patient.email}
                      </div>
                      <div className="text-xs text-earth-400">
                        {patient.mobile || "No mobile"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getDoshaColor(
                          patient.ayurvedicDosha
                        )}`}
                      >
                        {patient.ayurvedicDosha || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-primary-700 bg-primary-50 px-2 py-1 rounded border border-primary-100">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/dashboard/patients/${patient._id}`}
                        className="text-primary-600 hover:text-primary-800 font-semibold hover:underline decoration-primary-300 underline-offset-4"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {patients.length === 0 && (
              <div className="p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-earth-100 rounded-full flex items-center justify-center mb-4 text-earth-400">
                  <svg
                    className="w-8 h-8"
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
                </div>
                <h3 className="text-lg font-medium text-earth-900">
                  No patients found
                </h3>
                <p className="mt-1 text-earth-500">
                  Get started by adding your first patient.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

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
