import express from 'express';
// import { createOrder, verifyPayment, getPaymentHistory } from '../controllers/paymentController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Payment routes disabled
// router.post('/create-order', auth, createOrder);
// router.post('/verify-payment', auth, verifyPayment);
// router.get('/history', auth, getPaymentHistory);

export default router; 