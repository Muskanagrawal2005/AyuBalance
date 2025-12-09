import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../api/axiosInstance";

const AddPatientModal = ({ onClose, onSuccess }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      age: "",
      gender: "male",
      ayurvedicDosha: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      age: Yup.number().required("Age is required"),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        // API Call to create patient
        const { data } = await api.post("/dietitian/patients", values);

        // Success Message (Preserved your logic regarding email)
        alert(
          `Patient Created Successfully!\n\nAn email with login details has been sent to ${values.email}.`
        );

        onSuccess(); // Refresh the list
        onClose(); // Close the modal
      } catch (error) {
        setStatus(error.response?.data?.message || "Error creating patient");
      }
      setSubmitting(false);
    },
  });

  return (
    // Overlay with blur effect
    <div className="fixed inset-0 bg-primary-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all border border-earth-100">
        {/* Header */}
        <div className="bg-primary-900 p-6 flex justify-between items-center">
          <h2 className="text-xl font-serif font-bold text-white">
            Add New Patient
          </h2>
          <button
            onClick={onClose}
            className="text-primary-200 hover:text-white transition-colors"
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

        {/* Body */}
        <div className="p-8">
          {formik.status && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-center">
              <span className="mr-2">⚠️</span> {formik.status}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-bold text-earth-900 mb-1.5 ml-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ravi Kumar"
                {...formik.getFieldProps("name")}
                className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-earth-50/50 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all placeholder-earth-300"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-xs mt-1 ml-1 font-medium">
                  {formik.errors.name}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-earth-900 mb-1.5 ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="patient@example.com"
                {...formik.getFieldProps("email")}
                className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-earth-50/50 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all placeholder-earth-300"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-xs mt-1 ml-1 font-medium">
                  {formik.errors.email}
                </div>
              )}
            </div>

            {/* Three Column Grid for smaller details */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-earth-900 mb-1.5 ml-1">
                  Age
                </label>
                <input
                  type="number"
                  placeholder="35"
                  {...formik.getFieldProps("age")}
                  className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-earth-50/50 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-earth-900 mb-1.5 ml-1">
                  Gender
                </label>
                <select
                  {...formik.getFieldProps("gender")}
                  className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-earth-50/50 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all appearance-none"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-earth-900 mb-1.5 ml-1">
                  Dosha
                </label>
                <select
                  {...formik.getFieldProps("ayurvedicDosha")}
                  className="w-full px-4 py-3 rounded-xl border border-earth-200 bg-earth-50/50 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all appearance-none"
                >
                  <option value="">Select...</option>
                  <option value="Vata">Vata</option>
                  <option value="Pitta">Pitta</option>
                  <option value="Kapha">Kapha</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-earth-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-earth-600 hover:bg-earth-100 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="px-6 py-3 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-semibold shadow-lg shadow-primary-900/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? "Creating..." : "Create Patient"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPatientModal;
