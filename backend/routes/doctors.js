import express from 'express';
import {
  getAllDoctors,
  getDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorPatients,
  getPendingDoctors,
  approveDoctor
} from '../controllers/doctorController.js';
import { verifyToken, isDoctor, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctor);

// Doctor routes
router.get('/profile', verifyToken, isDoctor, getDoctorProfile);
router.put('/profile', verifyToken, isDoctor, updateDoctorProfile);
router.get('/patients', verifyToken, isDoctor, getDoctorPatients);

// Admin routes
router.get('/pending', verifyToken, isAdmin, getPendingDoctors);
router.put('/:id/approve', verifyToken, isAdmin, approveDoctor);

export default router; 