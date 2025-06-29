import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getAllDoctors,
  getPendingDoctors,
  approveDoctor,
  deleteUser,
  deleteDoctor,
  getAnalytics
} from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(verifyToken, isAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/doctors', getAllDoctors);
router.get('/doctors/pending', getPendingDoctors);
router.put('/doctors/:id/approve', approveDoctor);
router.delete('/users/:id', deleteUser);
router.delete('/doctors/:id', deleteDoctor);
router.get('/analytics', getAnalytics);

export default router; 