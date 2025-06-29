# 🛠️ MediConnect Setup Guide

This guide will walk you through setting up the MediConnect project for development and deployment.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB Atlas** account - [Sign up here](https://www.mongodb.com/atlas)
- **Cloudinary** account - [Sign up here](https://cloudinary.com/)

## 📄 Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project

### 2. Create a Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider and region
4. Click "Create"

### 3. Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Select "Read and write to any database"
6. Click "Add User"

### 4. Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your specific IP addresses
5. Click "Confirm"

### 5. Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `mediconnect`

## ☁️ Cloudinary Setup

### 1. Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email

### 2. Get Credentials
1. Go to your Dashboard
2. Note down:
   - Cloud Name
   - API Key
   - API Secret

## 🚀 Project Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd mediconnect-mern-main
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/mediconnect?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Configuration (Optional)
ADMIN_EMAIL=admin@mediconnect.com
ADMIN_PASSWORD=admin123
```

#### Start Backend Server
```bash
npm start
```

The backend will be running at `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Environment Configuration
Create a `.env.local` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`

### 4. Admin Dashboard Setup (Optional)

#### Install Dependencies
```bash
cd ../admin
npm install
```

#### Start Admin Dashboard
```bash
npm run dev
```

The admin dashboard will be running at `http://localhost:5174`

## 📊 Database Seeding

### Add Sample Data

#### 1. Add Sample Doctors
```bash
cd backend
node scripts/add-sample-doctors.js
```

This will add 10 sample doctors with the following credentials:
- **Email**: `emily.rodriguez@mediconnect.com`
- **Password**: `doctor123`

#### 2. Add Sample Appointments (Optional)
```bash
cd backend
node scripts/add-sample-appointments.js
```

**Note**: You need to create a patient account first before running this script.

## 👥 User Accounts

### Default Admin Account
- **Email**: `admin@mediconnect.com`
- **Password**: `admin123`

### Sample Doctor Account
- **Email**: `emily.rodriguez@mediconnect.com`
- **Password**: `doctor123`

### Create Patient Account
1. Go to the frontend application
2. Click "Register"
3. Select "Patient" role
4. Fill in your details
5. Complete registration

## 🧪 Testing the Application

### 1. Test Backend API
```bash
# Health check
curl http://localhost:5000/api/health

# Test doctor login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"emily.rodriguez@mediconnect.com","password":"doctor123","role":"doctor"}'
```

### 2. Test Frontend
1. Open `http://localhost:5173` in your browser
2. Register as a patient
3. Browse doctors
4. Book an appointment
5. Login as a doctor to manage appointments

### 3. Test Admin Dashboard
1. Open `http://localhost:5174` in your browser
2. Login with admin credentials
3. Test user management features

## 🚀 Deployment

### Backend Deployment (Railway/Render)

#### Railway Deployment
1. Go to [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Create a new project
4. Add environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secure_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
5. Deploy automatically

#### Render Deployment
1. Go to [Render](https://render.com/)
2. Connect your GitHub repository
3. Create a new Web Service
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables
6. Deploy

### Frontend Deployment (Vercel)

1. Go to [Vercel](https://vercel.com/)
2. Connect your GitHub repository
3. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables:
   ```
   VITE_API_BASE_URL=your_backend_url
   ```
5. Deploy

### Environment Variables for Production

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mediconnect
JWT_SECRET=your-very-secure-jwt-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
- Check your connection string
- Ensure network access is configured
- Verify database user credentials

#### 2. CORS Error
- Check if backend is running
- Verify API base URL in frontend
- Check CORS configuration in backend

#### 3. JWT Token Error
- Verify JWT_SECRET is set
- Check token expiration
- Ensure proper token format

#### 4. Cloudinary Upload Error
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper file format

### Debug Commands

#### Check Backend Logs
```bash
cd backend
npm start
```

#### Check Frontend Build
```bash
cd frontend
npm run build
```

#### Test Database Connection
```bash
cd backend
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Connection error:', err));
"
```

## 📱 Mobile Testing

### Responsive Design
- Test on different screen sizes
- Use browser dev tools
- Test on actual mobile devices

### Performance Testing
- Use Lighthouse for performance audit
- Check bundle size
- Optimize images

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Configure CORS properly
- [ ] Validate all inputs
- [ ] Use HTTPS in production
- [ ] Set up proper error handling
- [ ] Configure rate limiting
- [ ] Set up monitoring

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Review error logs
3. Verify environment variables
4. Test API endpoints
5. Check database connection

For additional help, create an issue in the repository.

---

**Happy Coding! 🚀** 