import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../api/axiosInstance";

const EditPatientModal = ({ patient, onClose, onSuccess }) => {
  const formik = useFormik({
    initialValues: {
      name: patient.name || "",
      mobile: patient.mobile || "",
      age: patient.age || "",
      gender: patient.gender || "male",
      ayurvedicDosha: patient.ayurvedicDosha || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      age: Yup.number().required("Age is required"),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await api.put(`/dietitian/patients/${patient._id}`, values);
        // alert("Patient updated successfully!"); // Optional: quieter UX is often better
        onSuccess();
        onClose();
      } catch (error) {
        setStatus(error.response?.data?.message || "Update failed");
      }
      setSubmitting(false);
    },
  });

  // Shared Styles
  const inputClass =
    "w-full p-3 bg-earth-50 border border-earth-200 rounded-xl font-medium text-earth-800 outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all";
  const labelClass =
    "block text-xs font-bold text-earth-500 uppercase tracking-wider mb-1 ml-1";

  // Dynamic Color for Dosha Selection
  const getDoshaColorClass = (dosha) => {
    switch (dosha) {
      case "Vata":
        return "bg-purple-50 border-purple-200 text-purple-900 focus:ring-purple-200";
      case "Pitta":
        return "bg-orange-50 border-orange-200 text-orange-900 focus:ring-orange-200";
      case "Kapha":
        return "bg-blue-50 border-blue-200 text-blue-900 focus:ring-blue-200";
      default:
        return "bg-earth-50 border-earth-200 text-earth-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-primary-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-earth-100">
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary-900">
              Edit Patient
            </h2>
            <p className="text-earth-500 text-sm">
              Update personal details and constitution.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-earth-50 rounded-full text-earth-400 hover:bg-earth-100 transition-colors"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {formik.status && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {formik.status}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Name & Mobile */}
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                {...formik.getFieldProps("name")}
                className={inputClass}
                placeholder="Patient Name"
              />
            </div>
            <div>
              <label className={labelClass}>Mobile Number</label>
              <input
                type="text"
                {...formik.getFieldProps("mobile")}
                className={inputClass}
                placeholder="+91..."
              />
            </div>
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Age</label>
              <input
                type="number"
                {...formik.getFieldProps("age")}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select
                {...formik.getFieldProps("gender")}
                className={inputClass}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Dosha Selector (Highlighted) */}
          <div className="pt-2">
            <label className={labelClass}>Dominant Dosha</label>
            <div className="relative">
              <select
                {...formik.getFieldProps("ayurvedicDosha")}
                className={`w-full p-3 border rounded-xl font-bold outline-none appearance-none transition-all ${getDoshaColorClass(
                  formik.values.ayurvedicDosha
                )}`}
              >
                <option value="">-- Select Constitution --</option>
                <option value="Vata">🟣 Vata (Air/Ether)</option>
                <option value="Pitta">🟠 Pitta (Fire/Water)</option>
                <option value="Kapha">🔵 Kapha (Earth/Water)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-current opacity-50">
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-earth-100 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-bold text-earth-600 hover:bg-earth-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-900/20 hover:scale-[1.02] transition-transform"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatientModal;
