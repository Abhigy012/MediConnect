import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/hero-image.png'; // Add your image here

const doctorImages = [
  'https://res.cloudinary.com/dbeartopf/image/upload/v1751187647/mediconnect/doctors/doctor-1-1751187644919.jpg',
  'https://res.cloudinary.com/dbeartopf/image/upload/v1751187648/mediconnect/doctors/doctor-2-1751187647541.jpg',
  'https://res.cloudinary.com/dbeartopf/image/upload/v1751187650/mediconnect/doctors/doctor-4-1751187649568.jpg',
  'https://res.cloudinary.com/dbeartopf/image/upload/v1751187652/mediconnect/doctors/doctor-5-1751187651240.jpg',
  'https://res.cloudinary.com/dbeartopf/image/upload/v1751187655/mediconnect/doctors/doctor-8-1751187653788.jpg'
];

// Updated hero image to team of doctors with transparent background
const HERO_IMAGE = heroImage;

const Home = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    // Fetch top 5 experienced doctors
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        if (data.success && data.data && data.data.doctors) {
          // Sort by experience (desc), fallback to rating if needed
          const sorted = [...data.data.doctors].sort((a, b) => (b.experience || 0) - (a.experience || 0));
          setDoctors(sorted.slice(0, 5));
        }
      } catch (err) {
        setDoctors([]);
      }
    };
    fetchDoctors();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (!carouselRef.current || doctors.length <= 1) return;
    let scrollAmount = 0;
    const carousel = carouselRef.current;
    let interval = setInterval(() => {
      if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
        scrollAmount = 0;
      } else {
        scrollAmount += 220; // card width + gap
        carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [doctors]);

  return (
    <div className="min-h-screen">
      {/* Optimized Hero Section */}
      <section className="relative overflow-hidden text-white bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container relative z-10 mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between min-h-[80vh] lg:min-h-[90vh] px-4 lg:px-8">
            {/* Left: Content */}
            <div className="flex flex-col items-center w-full py-16 space-y-8 text-center lg:w-1/2 lg:py-0 lg:text-left lg:items-start">
              {/* Trust Badge */}
              <div className="flex items-center px-4 py-2 space-x-2 text-sm font-medium rounded-full bg-white/10 backdrop-blur-sm">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Trusted by 500+ patients</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                  <span className="block">Your Health,</span>
                  <span className="block text-blue-200">Our Priority</span>
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-blue-100 sm:text-xl lg:text-2xl">
                  Connect with verified doctors and book appointments instantly.
                  Experience healthcare that puts you first.
                </p>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                <div className="flex items-center space-x-2">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Instant Booking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Verified Doctors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>24/7 Support</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col w-full gap-4 sm:flex-row sm:w-auto">
                {user ? (
                  <>
                    {user.role === 'patient' ? (
                      <Link
                        to="/patient/doctors"
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/20"
                      >
                        <span>Book Appointment</span>
                        <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    ) : user.role === 'doctor' ? (
                      <Link
                        to="/doctor/appointments"
                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/20"
                      >
                        <span>View Appointments</span>
                        <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </Link>
                    ) : null}
                    <Link
                      to={user.role === 'patient' ? '/patient/dashboard' :
                        user.role === 'doctor' ? '/doctor/dashboard' : '/admin/dashboard'}
                      className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 border-2 group border-white/30 rounded-xl backdrop-blur-sm hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-white/20"
                    >
                      <span>Go to Dashboard</span>
                      <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/20"
                    >
                      <span>Get Started</span>
                      <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    <Link
                      to="/register"
                      className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 border-2 group border-white/30 rounded-xl backdrop-blur-sm hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-white/20"
                    >
                      <span>Register Now</span>
                      <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </Link>
                  </>
                )}
              </div>

              {/* Social Proof */}
              <div className="flex items-center space-x-6 text-sm text-blue-200">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[
                      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
                    ].map((imageUrl, i) => (
                      <img
                        key={i}
                        src={imageUrl}
                        alt={`Active patient ${i + 1}`}
                        className="object-cover w-8 h-8 border-2 border-blue-600 rounded-full"
                      />
                    ))}
                  </div>
                  <span>500+ active patients</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span>4.9/5 rating</span>
                </div>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="flex justify-center w-full lg:w-1/2 lg:justify-end">
              <div className="relative w-full max-w-lg">
                {/* Main Image */}
                <div className="relative overflow-hidden transition-transform duration-500 transform shadow-2xl rounded-2xl rotate-3 hover:rotate-0">
                  <img
                    src={HERO_IMAGE}
                    alt="Team of healthcare professionals"
                    className="w-full h-[400px] lg:h-[500px] object-contain bg-gradient-to-br from-blue-50 to-blue-100"
                    loading="eager"
                  />
                </div>

                {/* Floating Elements */}
                <div className="absolute p-4 bg-white shadow-lg -top-4 -right-4 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Available 24/7</p>
                      <p className="text-xs text-gray-600">Emergency care</p>
                    </div>
                  </div>
                </div>

                <div className="absolute p-4 bg-white shadow-lg -bottom-4 -left-4 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Expert Doctors</p>
                      <p className="text-xs text-gray-600">Verified & licensed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute transform -translate-x-1/2 bottom-8 left-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Doctor Carousel Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto">
          <h2 className="mb-8 text-3xl font-bold text-center">Meet Our Experienced Doctors</h2>
          <div
            ref={carouselRef}
            className="flex gap-6 px-2 pb-4 overflow-x-auto md:px-0 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollBehavior: 'smooth' }}
          >
            {doctors.length === 0 ? (
              <div className="w-full text-center text-gray-500">No doctors found.</div>
            ) : (
              doctors.map((doc, idx) => (
                <div
                  key={doc._id || idx}
                  className="min-w-[220px] max-w-xs bg-blue-50 rounded-2xl shadow-md p-5 flex flex-col items-center snap-center group hover:bg-blue-100 transition"
                >
                  <img
                    src={doc.profilePicture || doc.imageUrl || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                    alt={doc.name}
                    className="object-cover w-24 h-24 mb-3 transition-transform border-4 border-white rounded-full shadow group-hover:scale-105"
                  />
                  <h3 className="mb-1 text-lg font-bold text-center text-blue-900">{doc.name}</h3>
                  <p className="mb-1 font-medium text-center text-blue-600">{doc.specialization}</p>
                  <p className="mb-1 text-sm text-center text-gray-700">{doc.experience} years experience</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center">Why Choose MediConnect?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Easy Booking</h3>
              <p className="text-gray-600">
                Book appointments with your preferred doctors in just a few clicks.
              </p>
            </div>
            <div className="p-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Verified Doctors</h3>
              <p className="text-gray-600">
                All our doctors are verified and have proper medical licenses.
              </p>
            </div>
            <div className="p-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Quick Service</h3>
              <p className="text-gray-600">
                Get quick access to healthcare services when you need them most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-white bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mb-8 text-xl">
            Join thousands of patients who trust MediConnect for their healthcare needs.
          </p>
          {user ? (
            user.role === 'patient' ? (
              <Link
                to="/patient/doctors"
                className="px-8 py-3 font-semibold text-blue-600 transition bg-white rounded-lg hover:bg-gray-100"
              >
                Book Appointment
              </Link>
            ) : user.role === 'doctor' ? (
              <Link
                to="/doctor/appointments"
                className="px-8 py-3 font-semibold text-blue-600 transition bg-white rounded-lg hover:bg-gray-100"
              >
                View Appointments
              </Link>
            ) : (
              <Link
                to="/admin/dashboard"
                className="px-8 py-3 font-semibold text-blue-600 transition bg-white rounded-lg hover:bg-gray-100"
              >
                Go to Dashboard
              </Link>
            )
          ) : (
            <Link
              to="/register"
              className="px-8 py-3 font-semibold text-blue-600 transition bg-white rounded-lg hover:bg-gray-100"
            >
              Register Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
