import express from 'express';
import { 
  registerPatient, 
  registerDoctor, 
  login, 
  logout, 
  getProfile, 
  updateProfile, 
  changePassword, 
  forgotPassword, 
  resetPassword 
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register/patient', registerPatient);
router.post('/register/doctor', registerDoctor);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/logout', verifyToken, logout);
router.get('/me', verifyToken, getProfile);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);

export default router; 