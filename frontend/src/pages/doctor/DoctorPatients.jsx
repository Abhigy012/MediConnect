import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('/api/doctors/patients');
      setPatients(response.data.data.patients);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            My Patients
          </h1>
          <p className="text-gray-600">
            View and manage your patient information
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Patients
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Patients List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 text-lg">
                {searchTerm ? 'No patients found matching your search.' : 'No patients found.'}
              </p>
            </div>
          ) : (
            filteredPatients.map(patient => (
              <div key={patient._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-green-600">
                        {patient.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-gray-600">{patient.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span> {patient.phone || 'Not provided'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Age:</span> {
                        patient.dateOfBirth 
                          ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
                          : 'Not provided'
                      } years
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Gender:</span> {patient.gender || 'Not specified'}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                      View History
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {filteredPatients.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{filteredPatients.length}</p>
                <p className="text-gray-600">Total Patients</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {filteredPatients.filter(p => p.gender === 'male').length}
                </p>
                <p className="text-gray-600">Male Patients</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-600">
                  {filteredPatients.filter(p => p.gender === 'female').length}
                </p>
                <p className="text-gray-600">Female Patients</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatients; 