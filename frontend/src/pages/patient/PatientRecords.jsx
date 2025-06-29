import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const PatientRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/appointments');
      if (data.success && data.data && data.data.appointments) {
        // Only show past appointments (date < today, not cancelled)
        const now = new Date();
        const pastRecords = data.data.appointments.filter(app => {
          const appDate = new Date(app.appointmentDate);
          return appDate < now && app.status !== 'cancelled';
        });
        setRecords(pastRecords);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Medical Records
          </h1>
          <p className="text-gray-600">
            View your complete medical history and treatment records
          </p>
        </div>

        <div className="space-y-6">
          {records.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 text-lg">No medical records found.</p>
              <p className="text-gray-500 mt-2">Your records will appear here after your appointments.</p>
            </div>
          ) : (
            records.map((record) => (
              <div key={record._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {record.doctor?.name || 'Doctor'}
                    </h3>
                    <p className="text-blue-600 font-medium">{record.doctor?.specialization || 'Specialization'}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(record.appointmentDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                      {record.diagnosis || record.notes?.doctor || 'No diagnosis/notes provided.'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Prescription</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                      {record.prescription?.notes || 'No prescription provided.'}
                    </p>
                  </div>
                </div>

                {record.notes?.patient && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Your Notes</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                      {record.notes.patient}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRecords; 