# 📚 MediConnect API Documentation

This document provides comprehensive documentation for the MediConnect API endpoints.

## 🔗 Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-backend-url.com/api`

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📋 API Endpoints

### 🔑 Authentication Endpoints

#### 1. User Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "patient" // "patient", "doctor", or "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "patient",
    "profilePicture": "https://res.cloudinary.com/...",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "gender": "male"
  }
}
```

#### 2. Patient Registration
```http
POST /auth/register/patient
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Patient registered successfully",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "gender": "male"
  }
}
```

#### 3. Doctor Registration
```http
POST /auth/register/doctor
```

**Request Body:**
```json
{
  "name": "Dr. Emily Rodriguez",
  "email": "emily.rodriguez@mediconnect.com",
  "password": "doctor123",
  "phone": "+1234567890",
  "specialization": "Cardiology",
  "experience": 8,
  "licenseNumber": "MD123456",
  "hospital": {
    "name": "City General Hospital",
    "address": "123 Medical Center Dr",
    "city": "New York",
    "state": "NY"
  },
  "consultationFee": 150
}
```

**Response:**
```json
{
  "success": true,
  "message": "Doctor registered successfully. Pending admin approval.",
  "doctor": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Dr. Emily Rodriguez",
    "email": "emily.rodriguez@mediconnect.com",
    "specialization": "Cardiology",
    "experience": 8,
    "isApproved": false
  }
}
```

#### 4. Get User Profile
```http
GET /auth/profile
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "profilePicture": "https://res.cloudinary.com/...",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "gender": "male"
  }
}
```

#### 5. Update User Profile
```http
PUT /auth/profile
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "role": "patient",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "gender": "male"
  }
}
```

### 👨‍⚕️ Doctor Endpoints

#### 1. Get All Doctors
```http
GET /doctors
```

**Query Parameters:**
- `specialization` (optional): Filter by specialization
- `search` (optional): Search by name
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

**Response:**
```json
{
  "success": true,
  "doctors": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Dr. Emily Rodriguez",
      "email": "emily.rodriguez@mediconnect.com",
      "specialization": "Cardiology",
      "experience": 8,
      "licenseNumber": "MD123456",
      "hospital": {
        "name": "City General Hospital",
        "address": "123 Medical Center Dr",
        "city": "New York",
        "state": "NY"
      },
      "consultationFee": 150,
      "isApproved": true,
      "profilePicture": "https://res.cloudinary.com/...",
      "rating": 4.8,
      "totalAppointments": 125
    }
  ],
  "totalDoctors": 1,
  "currentPage": 1,
  "totalPages": 1
}
```

#### 2. Get Doctor by ID
```http
GET /doctors/:id
```

**Response:**
```json
{
  "success": true,
  "doctor": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Dr. Emily Rodriguez",
    "email": "emily.rodriguez@mediconnect.com",
    "specialization": "Cardiology",
    "experience": 8,
    "licenseNumber": "MD123456",
    "hospital": {
      "name": "City General Hospital",
      "address": "123 Medical Center Dr",
      "city": "New York",
      "state": "NY"
    },
    "consultationFee": 150,
    "isApproved": true,
    "profilePicture": "https://res.cloudinary.com/...",
    "rating": 4.8,
    "totalAppointments": 125,
    "availableSlots": [
      "09:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00"
    ]
  }
}
```

#### 3. Get Pending Doctors (Admin Only)
```http
GET /doctors/pending
```

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "doctors": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Dr. New Doctor",
      "email": "new.doctor@mediconnect.com",
      "specialization": "Neurology",
      "experience": 5,
      "isApproved": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### 4. Approve/Reject Doctor (Admin Only)
```http
PUT /doctors/:id/approve
```

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "isApproved": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Doctor approved successfully",
  "doctor": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Dr. New Doctor",
    "isApproved": true
  }
}
```

### 📅 Appointment Endpoints

#### 1. Get Appointments (Role-based)
```http
GET /appointments
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, confirmed, completed, cancelled)
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

**Response (Patient):**
```json
{
  "success": true,
  "appointments": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "patient": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "John Doe"
      },
      "doctor": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "Dr. Emily Rodriguez",
        "specialization": "Cardiology",
        "profilePicture": "https://res.cloudinary.com/..."
      },
      "appointmentDate": "2024-01-20T00:00:00.000Z",
      "appointmentTime": "10:00",
      "symptoms": "Chest pain and shortness of breath",
      "status": "confirmed",
      "consultationFee": 150,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "totalAppointments": 1,
  "currentPage": 1,
  "totalPages": 1
}
```

**Response (Doctor):**
```json
{
  "success": true,
  "appointments": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "patient": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "John Doe",
        "phone": "+1234567890",
        "dateOfBirth": "1990-01-01T00:00:00.000Z",
        "gender": "male"
      },
      "appointmentDate": "2024-01-20T00:00:00.000Z",
      "appointmentTime": "10:00",
      "symptoms": "Chest pain and shortness of breath",
      "status": "confirmed",
      "consultationFee": 150,
      "diagnosis": "",
      "prescription": "",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "totalAppointments": 1,
  "currentPage": 1,
  "totalPages": 1
}
```

#### 2. Book Appointment (Patient Only)
```http
POST /appointments
```

**Headers:**
```
Authorization: Bearer <patient-jwt-token>
```

**Request Body:**
```json
{
  "doctorId": "64f8a1b2c3d4e5f6a7b8c9d2",
  "appointmentDate": "2024-01-20",
  "appointmentTime": "10:00",
  "symptoms": "Chest pain and shortness of breath"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "patient": "64f8a1b2c3d4e5f6a7b8c9d1",
    "doctor": "64f8a1b2c3d4e5f6a7b8c9d2",
    "appointmentDate": "2024-01-20T00:00:00.000Z",
    "appointmentTime": "10:00",
    "symptoms": "Chest pain and shortness of breath",
    "status": "pending",
    "consultationFee": 150,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 3. Update Appointment Status (Doctor Only)
```http
PUT /appointments/:id/status
```

**Headers:**
```
Authorization: Bearer <doctor-jwt-token>
```

**Request Body:**
```json
{
  "status": "completed",
  "diagnosis": "Angina pectoris",
  "prescription": "Nitroglycerin 0.4mg sublingual as needed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment status updated successfully",
  "appointment": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "status": "completed",
    "diagnosis": "Angina pectoris",
    "prescription": "Nitroglycerin 0.4mg sublingual as needed",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

### 👨‍💼 Admin Endpoints

#### 1. Get Dashboard Stats
```http
GET /admin/dashboard
```

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalPatients": 150,
    "totalDoctors": 25,
    "totalAppointments": 500,
    "pendingDoctors": 3,
    "todayAppointments": 15,
    "monthlyRevenue": 7500,
    "recentAppointments": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "patient": "John Doe",
        "doctor": "Dr. Emily Rodriguez",
        "appointmentDate": "2024-01-20T00:00:00.000Z",
        "status": "confirmed"
      }
    ]
  }
}
```

#### 2. Get All Users
```http
GET /admin/users
```

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Query Parameters:**
- `role` (optional): Filter by role (patient, doctor)
- `search` (optional): Search by name or email
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "patient",
      "phone": "+1234567890",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "totalUsers": 1,
  "currentPage": 1,
  "totalPages": 1
}
```

#### 3. Delete User (Admin Only)
```http
DELETE /admin/users/:id
```

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### 📁 File Upload Endpoints

#### 1. Upload Profile Picture
```http
POST /upload/profile-picture
```

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data
```

**Request Body:**
```
FormData with 'image' field containing the image file
```

**Response:**
```json
{
  "success": true,
  "message": "Profile picture uploaded successfully",
  "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/profile.jpg"
}
```

## 📊 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## 🔧 Rate Limiting

- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 5 requests per 15 minutes
- **File upload endpoints**: 10 requests per 15 minutes

## 📝 Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  role: String, // 'patient', 'doctor', 'admin'
  profilePicture: String,
  dateOfBirth: Date,
  gender: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Doctor Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  specialization: String,
  experience: Number,
  licenseNumber: String,
  hospital: {
    name: String,
    address: String,
    city: String,
    state: String
  },
  consultationFee: Number,
  isApproved: Boolean,
  profilePicture: String,
  rating: Number,
  totalAppointments: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Model
```javascript
{
  _id: ObjectId,
  patient: ObjectId (ref: 'User'),
  doctor: ObjectId (ref: 'Doctor'),
  appointmentDate: Date,
  appointmentTime: String,
  symptoms: String,
  status: String, // 'pending', 'confirmed', 'completed', 'cancelled'
  consultationFee: Number,
  diagnosis: String,
  prescription: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

### JWT Token Structure
```javascript
{
  "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "role": "patient",
  "iat": 1642234567,
  "exp": 1642320967
}
```

### Password Requirements
- Minimum 6 characters
- Should contain at least one letter and one number

### File Upload Restrictions
- **Allowed formats**: JPG, JPEG, PNG, GIF
- **Maximum size**: 5MB
- **Auto-optimization**: Enabled

## 🧪 Testing Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

---

**For additional support, please refer to the main README.md file.** 