import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

// --- HELPER TO LOAD RAZORPAY SCRIPT ---
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [dietitian, setDietitian] = useState(null);
  const [date, setDate] = useState('');
  const [slotTime, setSlotTime] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingDoctor, setFetchingDoctor] = useState(true);

  const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
  ];

  // 1. Fetch Dietitian Info
  useEffect(() => {
    const fetchDietitianInfo = async () => {
      try {
        const { data } = await api.get('/patient/profile');
        if (data.createdByDietitian) {
          setDietitian(data.createdByDietitian);
        }
      } catch (error) {
        console.error("Could not load dietitian details.");
      } finally {
        setFetchingDoctor(false);
      }
    };
    fetchDietitianInfo();
  }, []);

  const handleBooking = async () => {
    if (!date || !slotTime || !dietitian) return alert("Please select a date and time.");
    setLoading(true);

    try {
      // 1. LOAD RAZORPAY SCRIPT MANUALLY
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      // 2. Create Order on Backend
      const { data: order } = await api.post("/patient/appointments/order", { amount: 500 });

      // 3. Configure Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "AyurCare Wellness",
        description: "Consultation Fee",
        order_id: order.id,
        handler: async function (response) {
          try {
            await api.post("/patient/appointments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingDetails: {
                dietitianId: dietitian._id,
                date,
                slotTime,
                notes
              }
            });
            
            // Celebration Effect!
            const end = Date.now() + 1000;
            const colors = ['#6366f1', '#a855f7', '#ec4899'];
            (function frame() {
              confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
              });
              confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
              });
              if (Date.now() < end) {
                requestAnimationFrame(frame);
              }
            }());
            
            alert("Booking Confirmed! 🎉");
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
        theme: { color: "#4f46e5" }, 
      };

      // 4. Open Razorpay Window
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
      
    } catch (error) {
      console.error(error);
      alert("Booking failed. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingDoctor) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-indigo-400 font-bold animate-pulse">Connecting to Specialist...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 font-sans relative overflow-x-hidden pb-20">
      
      {/* Animated Background Mesh */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>

      <div className="max-w-5xl mx-auto px-6 pt-12 relative z-10">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
            Book Consultation
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3">
            Prioritize Your Health
          </h1>
          <p className="text-slate-400 text-lg">Schedule a personalized session with your Ayurvedic expert.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* --- LEFT COLUMN: DOCTOR INFO (4 cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/30 blur-3xl rounded-full"></div>
              
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-4xl shadow-xl shadow-indigo-500/20 text-white font-bold mb-4">
                  {dietitian?.name?.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Dr. {dietitian?.name || 'Unknown'}</h3>
                <p className="text-indigo-300 text-sm font-medium mb-6">{dietitian?.email}</p>
                
                <div className="flex justify-center gap-2">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                    Verified Expert
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/5 text-slate-300 text-sm italic leading-relaxed">
              "Regular consultations are key to maintaining your Dosha balance. Don't skip your check-ins!"
            </div>
          </div>

          {/* --- RIGHT COLUMN: BOOKING FORM (8 cols) --- */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 relative overflow-hidden">
              
              <div className="space-y-8 relative z-10">
                
                {/* 1. Date Selection */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">1. Select Date</label>
                  <div className="relative group">
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-6 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 text-lg focus:border-indigo-500 focus:ring-0 outline-none transition-all cursor-pointer hover:bg-white hover:border-indigo-200"
                      min={new Date().toISOString().split('T')[0]} 
                    />
                  </div>
                </div>

                {/* 2. Time Slot Selection */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">2. Choose Time</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSlotTime(time)}
                        className={`py-3 rounded-xl text-sm font-bold transition-all border-2 relative overflow-hidden group ${
                          slotTime === time
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg scale-105'
                          : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-600'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Notes Area */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">3. Notes for Doctor</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe symptoms, diet changes, or questions..."
                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-700 focus:border-indigo-500 focus:ring-0 outline-none transition-all resize-none h-32 hover:bg-white focus:bg-white"
                  ></textarea>
                </div>

                <hr className="border-slate-100" />

                {/* 4. Pay Button */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="w-full md:w-auto">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Payable</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-800">₹500</span>
                      <span className="text-sm font-bold text-slate-400">/ session</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleBooking}
                    disabled={loading}
                    className="w-full md:w-auto md:px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/30 overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : "Pay & Confirm"}
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookAppointment;