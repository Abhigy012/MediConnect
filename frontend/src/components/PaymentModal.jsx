import React, { useState } from 'react';

const PaymentModal = ({ appointment, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleRazorpayPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ appointmentId: appointment._id })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      const { order } = data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'MediConnect',
        description: 'Doctor Appointment Payment',
        order_id: order.id,
        handler: async function (response) {
          // Verify payment on backend
          const verifyRes = await fetch('/api/payments/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              appointmentId: appointment._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            onSuccess();
          } else {
            setError(verifyData.message);
          }
        },
        prefill: {
          name: appointment.patient?.name,
          email: appointment.patient?.email
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            onClose();
          }
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Doctor:</span>
              <span className="font-medium">Dr. {appointment.doctor?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Specialization:</span>
              <span>{appointment.doctor?.specialization}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{appointment.appointmentTime}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t pt-2">
              <span>Total Amount:</span>
              <span>₹{appointment.consultationFee}</span>
            </div>
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-2">
            {error}
          </div>
        )}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRazorpayPayment}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay ₹${appointment.consultationFee}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 