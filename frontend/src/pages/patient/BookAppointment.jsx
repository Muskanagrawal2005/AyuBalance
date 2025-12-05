import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Data State
  const [dietitians, setDietitians] = useState([]);
  const [selectedDietitian, setSelectedDietitian] = useState('');
  
  // Form State
  const [date, setDate] = useState('');
  const [slotTime, setSlotTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Fetch Dietitians (We need a simple endpoint for this, or just list the one who created you)
  // For this MVP, let's assume we have an endpoint or we hardcode the ID if you only have 1 dietitian.
  // Ideally: GET /api/patient/dietitians. 
  // QUICK FIX: Since we haven't built "Get All Dietitians", we can use the `createdBy` field from your profile if stored?
  // OR: Let's just create a quick endpoint or enter ID manually for testing.
  // BETTER: Let's assume you paste the Dietitian ID from your database for the first test.
  
  // TEMPORARY: Paste your Dietitian's ID here from MongoDB (The one who created this patient)
  const TEMP_DIETITIAN_ID = "693084360bdcf7d93d9ee01e"; 

  const handleBooking = async () => {
    if (!date || !slotTime) return alert("Please select date and time");
    setLoading(true);

    try {
      // Step A: Create Order on Backend
      const orderUrl = "/patient/appointments/order";
      const { data: order } = await api.post(orderUrl, { amount: 500 }); // 500 INR

      // Step B: Configure Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Frontend Key
        amount: order.amount,
        currency: order.currency,
        name: "AyurCare Practice",
        description: "Diet Consultation Fee",
        order_id: order.id, // The Order ID from Backend
        handler: async function (response) {
          // Step C: Payment Success! Verify on Backend
          try {
            const verifyUrl = "/patient/appointments/verify";
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingDetails: {
                dietitianId: selectedDietitian || TEMP_DIETITIAN_ID,
                date,
                slotTime,
                notes
              }
            };

            await api.post(verifyUrl, verifyData);
            alert("Payment Successful! Appointment Booked.");
            navigate('/patient/dashboard');
            
          } catch (error) {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile || "9999999999",
        },
        theme: {
          color: "#059669", // Emerald Green
        },
      };

      // Step D: Open Popup
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
      
    } catch (error) {
      console.error(error);
      alert("Booking failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow-md mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Book Appointment</h1>
      
      <div className="space-y-4">
        {/* Dietitian ID Input (Temporary until we list them) */}
        <div>
           <label className="block text-sm font-medium">Dietitian ID</label>
           <input 
             type="text" 
             placeholder="Paste Dietitian ID from DB"
             value={selectedDietitian}
             onChange={(e) => setSelectedDietitian(e.target.value)}
             className="w-full border p-2 rounded"
           />
           <p className="text-xs text-gray-500">
             (Check your MongoDB 'users' collection for the Dietitian's _id)
           </p>
        </div>

        <div>
           <label className="block text-sm font-medium">Date</label>
           <input 
             type="date" 
             value={date}
             onChange={(e) => setDate(e.target.value)}
             className="w-full border p-2 rounded"
           />
        </div>

        <div>
           <label className="block text-sm font-medium">Time Slot</label>
           <select 
             value={slotTime}
             onChange={(e) => setSlotTime(e.target.value)}
             className="w-full border p-2 rounded"
           >
             <option>10:00 AM</option>
             <option>11:00 AM</option>
             <option>02:00 PM</option>
             <option>04:00 PM</option>
           </select>
        </div>

        <div>
           <label className="block text-sm font-medium">Reason / Notes</label>
           <textarea 
             value={notes}
             onChange={(e) => setNotes(e.target.value)}
             className="w-full border p-2 rounded"
           ></textarea>
        </div>

        <div className="pt-4">
          <button 
            onClick={handleBooking}
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded font-bold hover:bg-emerald-700 transition"
          >
            {loading ? "Processing..." : "Pay ₹500 & Book"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;