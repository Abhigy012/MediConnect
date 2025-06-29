import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

const addSampleAppointments = async () => {
  console.log('📅 Adding Sample Appointments to MediConnect...\n');
  
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');
    
    // Get a doctor and a patient
    const doctor = await Doctor.findOne({ email: 'emily.rodriguez@mediconnect.com' });
    const patient = await User.findOne({ email: 'john.doe@example.com' });
    
    if (!doctor) {
      console.log('❌ Doctor not found. Please run add-sample-doctors.js first.');
      return;
    }
    
    if (!patient) {
      console.log('❌ Patient not found. Please create a patient account first.');
      return;
    }
    
    console.log(`👨‍⚕️ Using doctor: ${doctor.name}`);
    console.log(`👤 Using patient: ${patient.name}`);
    
    // Sample appointments
    const sampleAppointments = [
      {
        patient: patient._id,
        doctor: doctor._id,
        appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
        appointmentTime: '10:00',
        symptoms: 'Headache and fever for the past 2 days',
        status: 'pending',
        consultationFee: doctor.consultationFee
      },
      {
        patient: patient._id,
        doctor: doctor._id,
        appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
        appointmentTime: '14:30',
        symptoms: 'Skin rash on arms and legs',
        status: 'confirmed',
        consultationFee: doctor.consultationFee
      },
      {
        patient: patient._id,
        doctor: doctor._id,
        appointmentDate: new Date().toISOString().split('T')[0], // Today
        appointmentTime: '16:00',
        symptoms: 'Follow-up appointment for previous treatment',
        status: 'completed',
        consultationFee: doctor.consultationFee
      }
    ];
    
    console.log('\n💾 Saving appointments to database...');
    
    // Insert appointments into database
    const result = await Appointment.insertMany(sampleAppointments);
    
    console.log(`\n🎉 Successfully added ${result.length} appointments!`);
    
    // Display summary
    console.log('\n📊 Sample Appointments Added:');
    result.forEach((appointment, index) => {
      console.log(`${index + 1}. Date: ${appointment.appointmentDate} at ${appointment.appointmentTime}`);
      console.log(`   Status: ${appointment.status}`);
      console.log(`   Symptoms: ${appointment.symptoms}`);
      console.log(`   Fee: $${appointment.consultationFee}`);
      console.log('');
    });
    
    console.log('📝 Next steps:');
    console.log('1. Login as Dr. Emily Rodriguez');
    console.log('2. Go to /doctor/appointments');
    console.log('3. You should see these sample appointments');
    
  } catch (error) {
    console.error('\n❌ Error adding sample appointments:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
  }
};

// Run the script
addSampleAppointments(); 