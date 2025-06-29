import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/axios';

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [city, setCity] = useState('');

  const specializations = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Gynecology',
    'Ophthalmology',
    'Gastroenterology'
  ];

  useEffect(() => {
    fetchDoctors();
  }, [specialization, city]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (specialization) params.append('specialization', specialization);
      if (city) params.append('city', city);
      const requestUrl = `/doctors?${params}`;
      console.log('Fetching doctors from:', requestUrl);
      console.log('Specialization:', specialization, 'City:', city);

      const response = await api.get(requestUrl);
      console.log('Raw API response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      // Handle different response structures
      let doctorsData = [];
      if (response.data && response.data.doctors) {
        doctorsData = response.data.doctors;
      } else if (response.data && Array.isArray(response.data)) {
        doctorsData = response.data;
      } else if (response.data && response.data.data && response.data.data.doctors) {
        doctorsData = response.data.data.doctors;
      } else {
        doctorsData = [];
      }
      console.log('Processed doctorsData:', doctorsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received. Error request:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to get rating display
  const getRatingDisplay = (doctor) => {
    if (doctor.rating && doctor.rating.average) {
      return `${doctor.rating.average.toFixed(1)} ⭐ (${doctor.rating.count} reviews)`;
    } else if (doctor.rating && typeof doctor.rating === 'number') {
      return `${doctor.rating.toFixed(1)} ⭐`;
    } else {
      return 'No ratings yet';
    }
  };

  // Helper function to get location display
  const getLocationDisplay = (doctor) => {
    if (doctor.hospital && doctor.hospital.address) {
      const { city, state } = doctor.hospital.address;
      return city && state ? `${city}, ${state}` : city || state || 'Not specified';
    }
    return 'Not specified';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Doctor
          </h1>
          <p className="text-gray-600">
            Search and book appointments with qualified healthcare professionals
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                placeholder="Enter city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchDoctors}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Doctors List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading doctors...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doctor => (
              <div key={doctor._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      {doctor.profilePicture ? (
                        <img 
                          src={doctor.profilePicture} 
                          alt={doctor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-blue-600">
                          {doctor.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                      <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600">
                      <span className="font-medium">Experience:</span> {doctor.experience} years
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Location:</span> {getLocationDisplay(doctor)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Rating:</span> {getRatingDisplay(doctor)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Consultation Fee:</span> ${doctor.consultationFee}
                    </p>
                    {doctor.hospital && doctor.hospital.name && (
                      <p className="text-gray-600">
                        <span className="font-medium">Hospital:</span> {doctor.hospital.name}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/patient/book-appointment/${doctor._id}`}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-center hover:bg-blue-700 transition-colors"
                    >
                      Book Appointment
                    </Link>
                    <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No doctors found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch; 