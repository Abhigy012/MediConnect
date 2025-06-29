import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorSearch from './pages/patient/DoctorSearch';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import MyProfile from './pages/MyProfile';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorPatients from './pages/doctor/DoctorPatients';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDoctors from './pages/admin/AdminDoctors';
import PatientRecords from './pages/patient/PatientRecords';
import PatientProfile from './pages/patient/PatientProfile';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  console.log('🔒 ProtectedRoute check:', { user, loading, allowedRoles });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ No user, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log('❌ Role mismatch, redirecting to home. User role:', user.role, 'Allowed roles:', allowedRoles);
    return <Navigate to="/" />;
  }

  console.log('✅ Access granted');
  return children;
};

// Layout Component
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Patient Routes */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/patient/doctors" element={<DoctorSearch />} />
          <Route path="/patient/book-appointment/:doctorId" element={<BookAppointment />} />
          <Route path="/patient/appointments" element={<MyAppointments />} />
          <Route path="/patient/records" element={<PatientRecords />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
          
          {/* Protected Doctor Routes */}
          <Route
            path="/doctor/dashboard"
            element={<DoctorDashboard />}
          />
          <Route 
            path="/doctor/appointments" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/doctor/patients" 
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorPatients />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
          
          {/* Common Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;