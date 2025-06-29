import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function testStripeConnection() {
  try {
    console.log('🔍 Testing Stripe Connection...');
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2000,
      currency: 'usd',
      metadata: {
        test: 'true',
        appointmentId: 'test-appointment-123'
      }
    });

    console.log('✅ Stripe connection successful!');
    console.log('📋 Payment Intent created:');
    console.log(`   ID: ${paymentIntent.id}`);
    console.log(`   Amount: $${paymentIntent.amount / 100}`);
    console.log(`   Status: ${paymentIntent.status}`);
    console.log(`   Client Secret: ${paymentIntent.client_secret.substring(0, 20)}...`);

    return paymentIntent;
  } catch (error) {
    console.error('❌ Stripe connection failed:', error.message);
    throw error;
  }
}

async function runTests() {
  console.log('🚀 Starting Payment Integration Tests...\n');
  
  try {
    await testStripeConnection();
    
    console.log('\n🎉 Payment tests passed!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Set up your frontend environment variables');
    console.log('   2. Test the payment flow in the application');
    console.log('   3. Use test card numbers for testing');
    
  } catch (error) {
    console.error('\n💥 Payment tests failed!');
    console.error('   Check your Stripe configuration and try again.');
    process.exit(1);
  }
}

runTests(); 