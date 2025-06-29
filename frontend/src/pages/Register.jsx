import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
    // Patient specific fields
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    bloodGroup: '',
    // Doctor specific fields
    specialization: '',
    experience: '',
    licenseNumber: '',
    hospital: {
      name: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      phone: ''
    },
    consultationFee: '',
    workingDays: [],
    workingHours: {
      start: '',
      end: ''
    },
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const specializations = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'General Medicine', 'Gynecology', 'Neurology', 'Oncology',
    'Ophthalmology', 'Orthopedics', 'Pediatrics', 'Psychiatry',
    'Pulmonology', 'Radiology', 'Surgery', 'Urology', 'Other'
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const workingDaysOptions = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (name.includes('address.')) {
      const [, field] = name.split('address.');
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else if (name.includes('hospital.')) {
      const [, field] = name.split('hospital.');
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        setFormData(prev => ({
          ...prev,
          hospital: {
            ...prev.hospital,
            [parent]: {
              ...prev.hospital[parent],
              [child]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          hospital: {
            ...prev.hospital,
            [field]: value
          }
        }));
      }
    } else if (name.includes('workingHours.')) {
      const [, field] = name.split('workingHours.');
      setFormData(prev => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleWorkingDaysChange = (day) => {
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Role-specific validation
    if (formData.role === 'doctor') {
      if (!formData.specialization || !formData.experience || !formData.licenseNumber || !formData.consultationFee) {
        setError('Please fill in all required doctor fields');
        setLoading(false);
        return;
      }
    }

    try {
      const result = await register(formData, formData.role);
      if (result.success) {
        // Redirect based on role
        switch (formData.role) {
          case 'patient':
            navigate('/patient/dashboard');
            break;
          case 'doctor':
            navigate('/doctor/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Register as
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            {/* Common Fields */}
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <div className="mt-1">
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Patient Specific Fields */}
            {formData.role === 'patient' && (
              <div className="space-y-6 border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900">Patient Information</h3>
                
                {/* Address */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <input
                      id="address.street"
                      name="address.street"
                      type="text"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Street address"
                    />
                  </div>
                  <div>
                    <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      id="address.city"
                      name="address.city"
                      type="text"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="City"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <input
                      id="address.state"
                      name="address.state"
                      type="text"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700">
                      ZIP Code
                    </label>
                    <input
                      id="address.zipCode"
                      name="address.zipCode"
                      type="text"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>

                {/* Blood Group */}
                <div>
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Doctor Specific Fields */}
            {formData.role === 'doctor' && (
              <div className="space-y-6 border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900">Doctor Information</h3>
                
                {/* Specialization */}
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                    Specialization *
                  </label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Years of Experience *
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    required
                    value={formData.experience}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter years of experience"
                  />
                </div>

                {/* License Number */}
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                    License Number *
                  </label>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter medical license number"
                  />
                </div>

                {/* Consultation Fee */}
                <div>
                  <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700">
                    Consultation Fee (USD) *
                  </label>
                  <input
                    id="consultationFee"
                    name="consultationFee"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.consultationFee}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter consultation fee"
                  />
                </div>

                {/* Hospital Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-800">Hospital Information</h4>
                  
                  <div>
                    <label htmlFor="hospital.name" className="block text-sm font-medium text-gray-700">
                      Hospital Name *
                    </label>
                    <input
                      id="hospital.name"
                      name="hospital.name"
                      type="text"
                      required
                      value={formData.hospital.name}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter hospital name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="hospital.address.street" className="block text-sm font-medium text-gray-700">
                        Hospital Street
                      </label>
                      <input
                        id="hospital.address.street"
                        name="hospital.address.street"
                        type="text"
                        value={formData.hospital.address.street}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Hospital street"
                      />
                    </div>
                    <div>
                      <label htmlFor="hospital.address.city" className="block text-sm font-medium text-gray-700">
                        Hospital City
                      </label>
                      <input
                        id="hospital.address.city"
                        name="hospital.address.city"
                        type="text"
                        value={formData.hospital.address.city}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Hospital city"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="hospital.address.state" className="block text-sm font-medium text-gray-700">
                        Hospital State
                      </label>
                      <input
                        id="hospital.address.state"
                        name="hospital.address.state"
                        type="text"
                        value={formData.hospital.address.state}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Hospital state"
                      />
                    </div>
                    <div>
                      <label htmlFor="hospital.address.zipCode" className="block text-sm font-medium text-gray-700">
                        Hospital ZIP
                      </label>
                      <input
                        id="hospital.address.zipCode"
                        name="hospital.address.zipCode"
                        type="text"
                        value={formData.hospital.address.zipCode}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Hospital ZIP"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="hospital.phone" className="block text-sm font-medium text-gray-700">
                      Hospital Phone
                    </label>
                    <input
                      id="hospital.phone"
                      name="hospital.phone"
                      type="tel"
                      value={formData.hospital.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Hospital phone number"
                    />
                  </div>
                </div>

                {/* Working Hours */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-800">Working Hours</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="workingHours.start" className="block text-sm font-medium text-gray-700">
                        Start Time
                      </label>
                      <input
                        id="workingHours.start"
                        name="workingHours.start"
                        type="time"
                        value={formData.workingHours.start}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="workingHours.end" className="block text-sm font-medium text-gray-700">
                        End Time
                      </label>
                      <input
                        id="workingHours.end"
                        name="workingHours.end"
                        type="time"
                        value={formData.workingHours.end}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Working Days */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Days
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {workingDaysOptions.map(day => (
                        <label key={day} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.workingDays.includes(day)}
                            onChange={() => handleWorkingDaysChange(day)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="3"
                    value={formData.bio}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Tell us about your medical background and expertise..."
                  />
                </div>
              </div>
            )}

            {/* Password Fields */}
            <div className="space-y-6 border-t pt-6">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 