import axios from 'axios';

// Get the API base URL from environment variable or use default
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Debug logging
console.log('🔍 Environment Debug:');
console.log('  - MODE:', import.meta.env.MODE);
console.log('  - VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('  - Final API Base URL:', apiBaseUrl);
console.log('  - Is Production:', import.meta.env.PROD);
console.log('  - All VITE_ vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));

// Create axios instance with base URL
const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🚀 Making API request to:', config.baseURL + config.url);
    console.log('   Method:', config.method?.toUpperCase());
    console.log('   Data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 