import express from 'express';
import { 
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment
} from '../controllers/appointmentController.js';
import { verifyToken, isPatient, isDoctor, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get appointments based on user role
router.get('/', (req, res, next) => {
  if (req.userRole === 'admin') {
    return getAllAppointments(req, res, next);
  } else if (req.userRole === 'doctor') {
    return getDoctorAppointments(req, res, next);
  } else {
    return getPatientAppointments(req, res, next);
  }
});

// Create appointment (patients only)
router.post('/', isPatient, bookAppointment);

// Update appointment status (doctors only)
router.put('/:id/status', isDoctor, updateAppointmentStatus);

// Cancel appointment (patients only)
router.post('/cancel', isPatient, cancelAppointment);

export default router; 