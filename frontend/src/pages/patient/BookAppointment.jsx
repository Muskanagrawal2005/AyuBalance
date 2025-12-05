import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [dietitian, setDietitian] = useState(null); // Stores the full doctor object
  const [date, setDate] = useState('');
  const [slotTime, setSlotTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingDoctor, setFetchingDoctor] = useState(true);

  // 1. Fetch My Profile to find my Dietitian
  useEffect(() => {
    const fetchDietitianInfo = async () => {
      try {
        const { data } = await api.get('/patient/profile');
        if (data.createdByDietitian) {
          setDietitian(data.createdByDietitian);
        }
      } catch (error) {
        alert("Could not load dietitian details.");
      } finally {
        setFetchingDoctor(false);
      }
    };
    fetchDietitianInfo();
  }, []);

  const handleBooking = async () => {
    if (!date || !slotTime || !dietitian) return alert("Please fill all fields");
    setLoading(true);

    try {
      // Step A: Create Order
      const { data: order } = await api.post("/patient/appointments/order", { amount: 500 });

      // Step B: Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "AyurCare Practice",
        description: `Consultation with Dr. ${dietitian.name}`, // <--- Shows Doctor Name on Payment
        order_id: order.id,
        handler: async function (response) {
          try {
            await api.post("/patient/appointments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingDetails: {
                dietitianId: dietitian._id, // <--- AUTO-FILLED ID
                date,
                slotTime,
                notes
              }
            });
            alert("Appointment Booked Successfully!");
            navigate('/patient/dashboard');
          } catch (error) {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile,
        },
        theme: { color: "#059669" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
      
    } catch (error) {
      console.error(error);
      alert("Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingDoctor) return <div className="p-8 text-center">Loading Doctor Details...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow-md mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Book Appointment</h1>
      
      {/* Dietitian Info Card */}
      <div className="bg-blue-50 p-4 rounded border border-blue-100 mb-6">
        <p className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-1">Consulting Dietitian</p>
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full border border-blue-200">
             👨‍⚕️
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">Dr. {dietitian?.name || 'Unknown'}</p>
            <p className="text-sm text-gray-500">{dietitian?.email}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
           <label className="block text-sm font-medium">Select Date</label>
           <input 
             type="date" 
             value={date}
             onChange={(e) => setDate(e.target.value)}
             className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
             min={new Date().toISOString().split('T')[0]} // Prevent past dates
           />
        </div>

        <div>
           <label className="block text-sm font-medium">Time Slot</label>
           <select 
             value={slotTime}
             onChange={(e) => setSlotTime(e.target.value)}
             className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
           >
             <option>10:00 AM</option>
             <option>11:00 AM</option>
             <option>02:00 PM</option>
             <option>04:00 PM</option>
             <option>06:00 PM</option>
           </select>
        </div>

        <div>
           <label className="block text-sm font-medium">Reason / Notes</label>
           <textarea 
             value={notes}
             onChange={(e) => setNotes(e.target.value)}
             placeholder="Briefly describe your concern..."
             className="w-full border p-2 rounded h-24 focus:ring-2 focus:ring-emerald-500 outline-none"
           ></textarea>
        </div>

        <div className="pt-4">
          <button 
            onClick={handleBooking}
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded font-bold hover:bg-emerald-700 transition shadow-lg"
          >
            {loading ? "Processing..." : "Pay ₹500 & Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;