import React, { useState, useEffect } from 'react';
import api from '../../config/axios';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/');
      setAppointments(response.data.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setMessage({ type: 'error', text: 'Failed to fetch appointments' });
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    if (!window.confirm(`Are you sure you want to mark this appointment as ${status}?`)) {
      return;
    }

    setUpdating(appointmentId);
    setMessage({ type: '', text: '' });

    try {
      await api.put(`/appointments/${appointmentId}/status`, { status });
      setMessage({ type: 'success', text: `Appointment marked as ${status} successfully!` });
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error updating appointment:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update appointment status' 
      });
    } finally {
      setUpdating(null);
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return '✅';
      case 'pending': return '⏳';
      case 'cancelled': return '❌';
      case 'completed': return '✅';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            My Appointments
          </h1>
          <p className="text-gray-600">
            Manage and view all your scheduled appointments
          </p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700' 
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getStatusIcon(status)} {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-600 text-lg mb-2">No appointments found</p>
              <p className="text-gray-500 text-sm">
                {filter === 'all' 
                  ? 'You don\'t have any appointments yet. Patients will appear here when they book with you.'
                  : `No ${filter} appointments found.`
                }
              </p>
            </div>
          ) : (
            filteredAppointments.map(appointment => (
              <div key={appointment._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-lg font-bold text-blue-600">
                          {appointment.patient?.name?.charAt(0) || 'P'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.patient?.name || 'Patient Name'}
                        </h3>
                        <p className="text-gray-600">
                          {appointment.patient?.email || 'patient@email.com'}
                        </p>
                        {appointment.patient?.phone && (
                          <p className="text-gray-500 text-sm">
                            📞 {appointment.patient.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">📅 Date</p>
                        <p className="text-gray-900">
                          {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">🕐 Time</p>
                        <p className="text-gray-900">{appointment.appointmentTime}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)} {appointment.status}
                        </span>
                      </div>
                    </div>

                    {appointment.symptoms && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500 mb-1">🏥 Symptoms</p>
                        <p className="text-gray-900">{appointment.symptoms}</p>
                      </div>
                    )}

                    {appointment.diagnosis && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500 mb-1">🔍 Diagnosis</p>
                        <p className="text-gray-900">{appointment.diagnosis}</p>
                      </div>
                    )}

                    {appointment.prescription && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500 mb-1">💊 Prescription</p>
                        <p className="text-gray-900">{appointment.prescription}</p>
                      </div>
                    )}

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500">💰 Consultation Fee</p>
                      <p className="text-lg font-semibold text-green-600">${appointment.consultationFee}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
                    {appointment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                          disabled={updating === appointment._id}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {updating === appointment._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            '✅ Confirm'
                          )}
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                          disabled={updating === appointment._id}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {updating === appointment._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            '❌ Cancel'
                          )}
                        </button>
                      </>
                    )}
                    
                    {appointment.status === 'confirmed' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                        disabled={updating === appointment._id}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {updating === appointment._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          '✅ Mark Complete'
                        )}
                      </button>
                    )}

                    {appointment.status === 'completed' && (
                      <div className="text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          ✅ Completed
                        </span>
                      </div>
                    )}

                    {appointment.status === 'cancelled' && (
                      <div className="text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          ❌ Cancelled
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments; 