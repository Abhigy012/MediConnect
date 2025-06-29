import Razorpay from 'razorpay';
import crypto from 'crypto';
import Appointment from '../models/Appointment.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId)
      .populate('doctor', 'name consultationFee')
      .populate('patient', 'name email');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    if (appointment.patient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only pay for your own appointments' });
    }

    const amount = appointment.consultationFee * 100; // INR paise
    const options = {
      amount,
      currency: 'INR',
      receipt: `rcptid_${appointment._id}`,
      notes: {
        appointmentId: appointment._id.toString(),
        patientId: appointment.patient._id.toString(),
        doctorId: appointment.doctor._id.toString(),
        patientName: appointment.patient.name,
        doctorName: appointment.doctor.name
      }
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { appointmentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    // Verify signature
    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
    appointment.paymentStatus = 'paid';
    appointment.paymentMethod = 'razorpay';
    appointment.paymentId = razorpay_payment_id;
    appointment.status = 'confirmed';
    await appointment.save();
    res.status(200).json({ success: true, message: 'Payment verified and appointment confirmed' });
  } catch (error) {
    console.error('Razorpay payment verification error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user._id,
      paymentStatus: 'paid',
      paymentMethod: 'razorpay'
    })
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: {
        payments: appointments.map(apt => ({
          id: apt._id,
          doctorName: apt.doctor.name,
          specialization: apt.doctor.specialization,
          amount: apt.consultationFee,
          date: apt.appointmentDate,
          status: apt.status,
          paymentDate: apt.updatedAt
        }))
      }
    });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ success: false, message: 'Failed to get payment history' });
  }
}; 