# 🏥 MediConnect - Doctor Appointment Booking System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for booking doctor appointments. Built with modern web technologies and designed for scalability.

![MediConnect](https://img.shields.io/badge/MediConnect-Healthcare-blue)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue)

## 🎯 Project Overview

MediConnect is a comprehensive healthcare platform that connects patients with doctors for appointment booking. The system features role-based access control, real-time appointment management, and a modern, responsive UI.

### ✨ Key Features

#### 👥 **Multi-Role System**
- **Patients**: Book appointments, view medical records, manage profile
- **Doctors**: Manage appointments, update patient status, view dashboard
- **Admins**: User management, doctor approval, system oversight

#### 🏥 **Core Functionality**
- **Appointment Booking**: Easy appointment scheduling with available doctors
- **Real-time Status Updates**: Track appointment status (pending, confirmed, completed, cancelled)
- **Doctor Management**: Comprehensive doctor profiles with specializations
- **Patient Records**: Secure medical record management
- **Responsive Design**: Mobile-first approach with modern UI/UX

#### 🔒 **Security & Authentication**
- JWT-based authentication
- Role-based access control
- Secure password hashing
- Protected API endpoints

#### 🎨 **Modern UI/UX**
- Responsive design with Tailwind CSS
- Interactive components with React
- Real-time status updates
- Intuitive navigation

## 🏗️ Architecture

```
MediConnect/
├── frontend/          # React.js Patient Portal
├── admin/            # React.js Admin Dashboard  
├── backend/          # Node.js/Express.js API
└── docs/            # Documentation
```

### Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Frontend** | React.js + Vite | 18.2.0 |
| **Styling** | Tailwind CSS | 3.3.0 |
| **Backend** | Node.js + Express.js | 18+ |
| **Database** | MongoDB Atlas | Latest |
| **Authentication** | JWT | Latest |
| **File Upload** | Cloudinary | Latest |
| **Deployment** | Vercel/Railway | Latest |

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Cloudinary account
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mediconnect-mern-main
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## 📱 Application Structure

### Frontend (Patient Portal)
- **Home Page**: Landing page with doctor showcase
- **Authentication**: Login/Register with role selection
- **Doctor Search**: Browse and filter doctors by specialization
- **Appointment Booking**: Schedule appointments with selected doctors
- **Patient Dashboard**: View appointments, medical records, profile
- **Responsive Design**: Mobile-first approach

### Admin Dashboard
- **User Management**: View and manage all users
- **Doctor Approval**: Approve/reject doctor registrations
- **System Overview**: Analytics and system health
- **Content Management**: Manage platform content

### Backend API
- **Authentication Routes**: Login, register, profile management
- **Appointment Routes**: CRUD operations for appointments
- **Doctor Routes**: CRUD operations, search, approval
- **Admin Routes**: User management, analytics, system oversight
- **File Upload Routes**: Profile picture uploads

## 📄 Documentation
- See `/docs` for API documentation, deployment, and more.

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/login          # User login
POST /api/auth/register/patient  # Patient registration
POST /api/auth/register/doctor   # Doctor registration
GET  /api/auth/profile        # Get user profile
PUT  /api/auth/profile        # Update user profile
```

### Appointments
```
GET    /api/appointments      # Get appointments (role-based)
POST   /api/appointments      # Book appointment (patients)
PUT    /api/appointments/:id/status  # Update status (doctors)
```

### Doctors
```
GET /api/doctors              # Get all doctors
GET /api/doctors/:id          # Get specific doctor
GET /api/doctors/pending      # Get pending doctors (admin)
PUT /api/doctors/:id/approve  # Approve doctor (admin)
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  phone: String,
  role: String, // 'patient'
  profilePicture: String,
  dateOfBirth: Date,
  gender: String
}
```

### Doctor Model
```javascript
{
  name: String,
  email: String,
  password: String,
  phone: String,
  specialization: String,
  experience: Number,
  licenseNumber: String,
  hospital: Object,
  consultationFee: Number,
  isApproved: Boolean,
  profilePicture: String
}
```

### Appointment Model
```javascript
{
  patient: ObjectId,
  doctor: ObjectId,
  appointmentDate: Date,
  appointmentTime: String,
  symptoms: String,
  status: String, // 'pending', 'confirmed', 'completed', 'cancelled'
  consultationFee: Number,
  diagnosis: String,
  prescription: String
}
```

## 🎨 UI/UX Features

### Design Principles
- **Mobile-First**: Responsive design for all devices
- **Accessibility**: WCAG compliant components
- **Performance**: Optimized loading and rendering
- **User Experience**: Intuitive navigation and interactions

### Key Components
- **Navigation**: Role-based navigation with profile dropdown
- **Cards**: Modern card-based layouts for doctors and appointments
- **Forms**: Validated forms with error handling
- **Modals**: Interactive modals for confirmations
- **Loading States**: Skeleton loaders and spinners

## 🔒 Security Features

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control (RBAC)
- Protected API endpoints
- Secure password hashing with bcrypt

### Data Protection
- Input validation and sanitization
- CORS configuration
- Environment variable management
- Secure file upload handling

## 🚀 Deployment

### Backend Deployment (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Frontend Deployment (Vercel)
1. Connect your GitHub repository
2. Configure build settings
3. Deploy with automatic CI/CD

### Environment Variables
```env
# Production
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration (patient/doctor)
- [ ] User login/logout
- [ ] Doctor search and filtering
- [ ] Appointment booking
- [ ] Appointment status updates
- [ ] Profile management
- [ ] Admin functions
- [ ] Responsive design
- [ ] Error handling

## 📊 Performance Optimizations

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Bundle size optimization
- Caching strategies

### Backend
- Database indexing
- Query optimization
- Caching with Redis (future)
- Rate limiting

## 🔮 Future Enhancements

### Planned Features
- **Payment Integration**: Stripe/Razorpay integration
- **Video Consultations**: WebRTC implementation
- **Prescription Management**: Digital prescriptions
- **Notifications**: Email/SMS notifications
- **Analytics Dashboard**: Advanced analytics
- **Mobile App**: React Native application

### Technical Improvements
- **Real-time Updates**: Socket.io integration
- **Caching**: Redis implementation
- **Testing**: Unit and integration tests
- **CI/CD**: Automated testing and deployment
- **Monitoring**: Application monitoring and logging

## 👨‍💻 Development

### Code Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
└── assets/        # Static assets
```

### Coding Standards
- ESLint configuration
- Prettier formatting
- Component documentation
- Consistent naming conventions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the database
- All contributors and supporters

---

**MediConnect** - Connecting Healthcare, One Appointment at a Time 🏥
