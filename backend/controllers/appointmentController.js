const Appointment = require('../models/Appointment');
const Razorpay = require('razorpay');
const crypto = require('crypto');


// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    1. Create Payment Order (Step 1 of Booking)
// @route   POST /api/patient/appointments/order
exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body; // Amount in SMALLEST unit (e.g., Paise for INR)

        const options = {
            amount: amount * 100, // Convert Rupee to Paise (500 INR -> 50000 paise)
            currency: "INR",
            receipt: "order_rcptid_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);

        res.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    2. Verify Payment & Book Appointment (Step 2 of Booking)
// @route   POST /api/patient/appointments/verify
exports.verifyPaymentAndBook = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingDetails
        } = req.body;


        console.log("---------------- PAYMENT DEBUG ----------------");
        console.log("Order ID:", razorpay_order_id);
        console.log("Payment ID:", razorpay_payment_id);
        console.log("Received Signature:", razorpay_signature);
        console.log("Using Secret:", process.env.RAZORPAY_KEY_SECRET ? "YES (Hidden)" : "NO (Missing!)");

        // A. Verify Signature (Security Check)
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        console.log("Generated Signature:", expectedSignature);
        console.log("Match?", expectedSignature === razorpay_signature);
        console.log("-----------------------------------------------");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // B. Payment Success -> Save to DB
            const { dietitianId, date, slotTime, notes } = bookingDetails;

            const appointment = await Appointment.create({
                dietitian: dietitianId,
                patient: req.user._id,
                date: new Date(date),
                slotTime,
                notes,
                status: 'confirmed', // Auto-confirmed because paid
                payment: {
                    amount: 500, // Store actual amount
                    razorpayOrderId: razorpay_order_id,
                    paymentStatus: 'paid'
                }
            });

            res.status(201).json({
                success: true,
                message: "Payment verified & Appointment booked",
                appointment
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid Signature" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Patient Appointments
// @route   GET /api/patient/appointments
exports.getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id })
            .populate('dietitian', 'name')
            .sort({ date: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Dietitian Appointments
// @route   GET /api/dietitian/appointments
exports.getDietitianAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ dietitian: req.user._id })
            .populate('patient', 'name mobile')
            .sort({ date: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

