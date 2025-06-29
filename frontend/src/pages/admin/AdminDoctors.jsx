import React, { useState, useEffect } from 'react';
import api from '../../config/axios';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/admin/doctors');
      setDoctors(response.data.data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveDoctor = async (doctorId, isApproved) => {
    try {
      await api.put(`/doctors/${doctorId}/approve`, { isApproved });
      fetchDoctors(); // Refresh the list
    } catch (error) {
      console.error('Error approving doctor:', error);
      alert('Failed to update doctor status');
    }
  };

  const deleteDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) {
      return;
    }

    try {
      await api.delete(`/admin/doctors/${doctorId}`);
      fetchDoctors(); // Refresh the list
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Failed to delete doctor');
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'pending' && !doctor.isApproved) ||
                         (filter === 'approved' && doctor.isApproved);
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (isApproved) => {
    return isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Doctor Management
          </h1>
          <p className="text-gray-600">
            Manage doctor accounts and approvals
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Doctors
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
                Filter by Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Doctors</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchDoctors}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 text-lg">No doctors found.</p>
            </div>
          ) : (
            filteredDoctors.map(doctor => (
              <div key={doctor._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-blue-600">
                        {doctor.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                      <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doctor.isApproved)}`}>
                        {doctor.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600">
                      <span className="font-medium">Experience:</span> {doctor.experience} years
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Location:</span> {doctor.hospital?.address?.city || 'Not specified'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Consultation Fee:</span> ₹{doctor.consultationFee}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span> {doctor.email}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span> {doctor.phone || 'Not provided'}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    {!doctor.isApproved ? (
                      <>
                        <button
                          onClick={() => approveDoctor(doctor._id, true)}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => approveDoctor(doctor._id, false)}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => approveDoctor(doctor._id, false)}
                        className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
                      >
                        Revoke Approval
                      </button>
                    )}
                    <button
                      onClick={() => deleteDoctor(doctor._id)}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{doctors.length}</p>
              <p className="text-gray-600">Total Doctors</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {doctors.filter(d => d.isApproved).length}
              </p>
              <p className="text-gray-600">Approved</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {doctors.filter(d => !d.isApproved).length}
              </p>
              <p className="text-gray-600">Pending</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {new Set(doctors.map(d => d.specialization)).size}
              </p>
              <p className="text-gray-600">Specializations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDoctors; 