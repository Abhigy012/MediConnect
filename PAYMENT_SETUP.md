# 💳 Payment Integration Setup Guide

## Overview
MediConnect uses **Stripe** for secure payment processing. This guide will help you set up payments for appointment bookings.

## 🚀 Quick Start

### 1. Stripe Account Setup
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create a new account or sign in
3. Get your API keys from the Developers section

### 2. Backend Configuration

#### Environment Variables
Add these to your `backend/.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

#### API Endpoints
The following payment endpoints are available:

- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm-payment` - Confirm payment
- `GET /api/payments/history` - Get payment history

### 3. Frontend Configuration

#### Environment Variables
Create `frontend/.env` file:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

#### Components
- `PaymentModal.jsx` - Payment form with Stripe Elements
- Updated `BookAppointment.jsx` - Integrated payment flow

## 🔧 Implementation Details

### Payment Flow
1. **Book Appointment** → Creates appointment with pending payment
2. **Payment Modal** → Opens Stripe payment form
3. **Payment Processing** → Secure card processing via Stripe
4. **Confirmation** → Updates appointment status to confirmed

### Security Features
- ✅ Secure payment processing via Stripe
- ✅ Payment intent validation
- ✅ User authentication required
- ✅ Appointment ownership verification
- ✅ Payment status tracking

### Database Schema
The `Appointment` model includes:
```javascript
paymentStatus: {
  type: String,
  enum: ['pending', 'paid', 'failed'],
  default: 'pending'
},
paymentMethod: {
  type: String,
  enum: ['stripe', 'razorpay', 'cash'],
  default: 'stripe'
},
paymentId: String
```

## 🧪 Testing

### Test Cards (Stripe Test Mode)
Use these test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Expiry**: Any future date
- **CVC**: Any 3 digits

### Test Mode vs Live Mode
- **Test Mode**: Use `sk_test_` and `pk_test_` keys
- **Live Mode**: Use `sk_live_` and `pk_live_` keys (production)

## 📱 User Experience

### Payment Modal Features
- ✅ Clean, professional design
- ✅ Real-time card validation
- ✅ Loading states
- ✅ Error handling
- ✅ Success confirmation

### Mobile Responsive
- ✅ Optimized for mobile devices
- ✅ Touch-friendly interface
- ✅ Responsive design

## 🔄 Alternative: Razorpay

If you prefer Razorpay (better for Indian market):

### Backend Changes
```javascript
// In paymentController.js
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
```

### Frontend Changes
```javascript
// Install razorpay
npm install razorpay

// Use Razorpay checkout
const options = {
  key: process.env.VITE_RAZORPAY_KEY_ID,
  amount: amount * 100,
  currency: "INR",
  name: "MediConnect",
  description: "Appointment Payment",
  order_id: orderId,
  handler: function (response) {
    // Handle success
  }
};
```

## 🚨 Security Notes

1. **Never expose secret keys** in frontend code
2. **Always validate payments** on the backend
3. **Use HTTPS** in production
4. **Implement webhook handling** for payment confirmations
5. **Store payment IDs** for reconciliation

## 📊 Monitoring

### Stripe Dashboard
- Monitor payments in real-time
- View transaction history
- Handle disputes and refunds
- Generate reports

### Application Logs
- Payment success/failure logs
- Error tracking
- User activity monitoring

## 🆘 Troubleshooting

### Common Issues
1. **Payment Intent Creation Failed**
   - Check Stripe secret key
   - Verify appointment exists
   - Check user authentication

2. **Payment Confirmation Failed**
   - Verify payment intent status
   - Check appointment ownership
   - Validate payment amount

3. **Frontend Errors**
   - Check Stripe publishable key
   - Verify network connectivity
   - Check browser console

### Support
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)
- [MediConnect Issues](https://github.com/your-repo/issues)

## 🎯 Best Practices

1. **Always test** with test cards first
2. **Implement proper error handling**
3. **Use webhooks** for reliable payment confirmation
4. **Store payment metadata** for tracking
5. **Implement retry logic** for failed payments
6. **Monitor payment analytics**

## 📈 Future Enhancements

- [ ] Subscription payments
- [ ] Multiple payment methods
- [ ] Payment plans
- [ ] Refund processing
- [ ] Payment analytics
- [ ] Invoice generation 