import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
import Doctor from '../models/Doctor.js';

const sampleDoctors = [
    {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@mediconnect.com",
        password: "doctor123",
        specialization: "General Medicine",
        experience: 8,
        education: "MBBS, MD - Internal Medicine",
        licenseNumber: "DOC001",
        hospital: {
            name: "City General Hospital",
            address: {
                street: "123 Main Street",
                city: "New York",
                state: "NY",
                zipCode: "10001"
            },
            phone: "+1-555-0101"
        },
        phone: "+1-555-0101",
        consultationFee: 80,
        workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        workingHours: {
            start: "09:00",
            end: "17:00"
        },
        bio: "Experienced general physician with expertise in preventive care and chronic disease management.",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop"
    },
    {
        name: "Dr. Michael Chen",
        email: "michael.chen@mediconnect.com",
        password: "doctor123",
        specialization: "Cardiology",
        experience: 12,
        education: "MBBS, MD - Cardiology, Fellowship in Interventional Cardiology",
        licenseNumber: "DOC002",
        hospital: {
            name: "Heart Care Institute",
            address: {
                street: "456 Heart Avenue",
                city: "Los Angeles",
                state: "CA",
                zipCode: "90210"
            },
            phone: "+1-555-0102"
        },
        phone: "+1-555-0102",
        consultationFee: 150,
        workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        workingHours: {
            start: "08:00",
            end: "16:00"
        },
        bio: "Board-certified cardiologist specializing in heart disease prevention and treatment.",
        imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"
    },
    {
        name: "Dr. Emily Rodriguez",
        email: "emily.rodriguez@mediconnect.com",
        password: "doctor123",
        specialization: "Dermatology",
        experience: 6,
        education: "MBBS, MD - Dermatology, Fellowship in Cosmetic Dermatology",
        licenseNumber: "DOC003",
        hospital: {
            name: "Skin Care Clinic",
            address: {
                street: "789 Beauty Lane",
                city: "Miami",
                state: "FL",
                zipCode: "33101"
            },
            phone: "+1-555-0103"
        },
        phone: "+1-555-0103",
        consultationFee: 120,
        workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        workingHours: {
            start: "10:00",
            end: "18:00"
        },
        bio: "Specialized in treating skin conditions and performing cosmetic procedures.",
        imageUrl: "https://images.unsplash.com/photo-1594824475545-9d0c7c4951c5?w=400&h=400&fit=crop"
    },
    {
        name: "Dr. James Wilson",
        email: "james.wilson@mediconnect.com",
        password: "doctor123",
        specialization: "Neurology",
        experience: 15,
        education: "MBBS, MD - Neurology, PhD in Neuroscience",
        licenseNumber: "DOC004",
        hospital: {
            name: "Neurological Institute",
            address: {
                street: "321 Brain Street",
                city: "Chicago",
                state: "IL",
                zipCode: "60601"
            },
            phone: "+1-555-0104"
        },
        phone: "+1-555-0104",
        consultationFee: 180,
        workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        workingHours: {
            start: "08:00",
            end: "16:00"
        },
        bio: "Expert in neurological disorders and brain-related conditions.",
        imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop"
    },
    {
        name: "Dr. Lisa Thompson",
        email: "lisa.thompson@mediconnect.com",
        password: "doctor123",
        specialization: "Pediatrics",
        experience: 10,
        education: "MBBS, MD - Pediatrics, Fellowship in Pediatric Emergency Medicine",
        licenseNumber: "DOC005",
        hospital: {
            name: "Children's Medical Center",
            address: {
                street: "654 Child Avenue",
                city: "Boston",
                state: "MA",
                zipCode: "02101"
            },
            phone: "+1-555-0105"
        },
        phone: "+1-555-0105",
        consultationFee: 100,
        workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        workingHours: {
            start: "09:00",
            end: "17:00"
        },
        bio: "Dedicated pediatrician with expertise in child development and pediatric care.",
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"
    },
    {
        name: "Dr. Maria Garcia",
        email: "maria.garcia@mediconnect.com",
        password: "doctor123",
        specialization: "Gynecology",
        experience: 9,
        education: "MBBS, MD - Obstetrics and Gynecology",
        licenseNumber: "DOC006",
        hospital: {
            name: "Women's Health Center",
            address: {
                street: "987 Women's Way",
                city: "Houston",
                state: "TX",
                zipCode: "77001"
            },
            phone: "+1-555-0106"
        },
        phone: "+1-555-0106",
        consultationFee: 130,
        workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        workingHours: {
            start: "09:00",
            end: "17:00"
        },
        bio: "Specialized in women's health, pregnancy care, and gynecological procedures.",
        imageUrl: "https://images.unsplash.com/photo-1594824475545-9d0c7c4951c5?w=400&h=400&fit=crop"
    },
    {
        name: "Dr. Robert Davis",
        email: "robert.davis@mediconnect.com",
        password: "doctor123",
        specialization: "Orthopedics",
        experience: 14,
        education: "MBBS, MS - Orthopedics, Fellowship in Joint Replacement",
        licenseNumber: "DOC007",
        hospital: {
            name: "Orthopedic Center",
            address: {
                street: "147 Bone Street",
                city: "Phoenix",
                state: "AZ",
                zipCode: "85001"
            },
            phone: "+1-555-0107"
        },
        phone: "+1-555-0107",
        consultationFee: 200,
        workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        workingHours: {
            start: "08:00",
            end: "16:00"
        },
        bio: "Expert in bone and joint surgery, specializing in sports injuries and joint replacement.",
        imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"
    },
    {
        name: "Dr. Jennifer Lee",
        email: "jennifer.lee@mediconnect.com",
        password: "doctor123",
        specialization: "Psychiatry",
        experience: 11,
        education: "MBBS, MD - Psychiatry, Fellowship in Child Psychiatry",
        licenseNumber: "DOC008",
        hospital: {
            name: "Mental Health Institute",
            address: {
                street: "258 Mind Avenue",
                city: "Seattle",
                state: "WA",
                zipCode: "98101"
            },
            phone: "+1-555-0108"
        },
        phone: "+1-555-0108",
        consultationFee: 160,
        workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        workingHours: {
            start: "10:00",
            end: "18:00"
        },
        bio: "Specialized in mental health treatment and psychiatric care for all age groups.",
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"
    },
    {
        name: "Dr. David Brown",
        email: "david.brown@mediconnect.com",
        password: "doctor123",
        specialization: "Ophthalmology",
        experience: 13,
        education: "MBBS, MD - Ophthalmology, Fellowship in Retinal Surgery",
        licenseNumber: "DOC009",
        hospital: {
            name: "Eye Care Institute",
            address: {
                street: "369 Vision Street",
                city: "Denver",
                state: "CO",
                zipCode: "80201"
            },
            phone: "+1-555-0109"
        },
        phone: "+1-555-0109",
        consultationFee: 140,
        workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        workingHours: {
            start: "09:00",
            end: "17:00"
        },
        bio: "Expert in eye care, vision correction, and surgical procedures.",
        imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop"
    },
    {
        name: "Dr. Amanda White",
        email: "amanda.white@mediconnect.com",
        password: "doctor123",
        specialization: "Gastroenterology",
        experience: 7,
        education: "MBBS, MD - Gastroenterology, Fellowship in Endoscopy",
        licenseNumber: "DOC010",
        hospital: {
            name: "Digestive Health Center",
            address: {
                street: "741 Digestive Lane",
                city: "Atlanta",
                state: "GA",
                zipCode: "30301"
            },
            phone: "+1-555-0110"
        },
        phone: "+1-555-0110",
        consultationFee: 170,
        workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        workingHours: {
            start: "08:00",
            end: "16:00"
        },
        bio: "Specialized in digestive system disorders and gastrointestinal procedures.",
        imageUrl: "https://images.unsplash.com/photo-1594824475545-9d0c7c4951c5?w=400&h=400&fit=crop"
    }
];

const addSampleDoctors = async () => {
    console.log('👨‍⚕️  Adding Sample Doctors to MediConnect...\n');
    
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
        
        // Check if doctors already exist
        const existingDoctors = await Doctor.countDocuments();
        if (existingDoctors > 0) {
            console.log(`⚠️  Found ${existingDoctors} existing doctors in database`);
            console.log('Do you want to add more doctors? (y/n)');
            // For now, we'll continue adding
        }
        
        console.log('\n📤 Uploading doctor profile images to Cloudinary...');
        
        const doctorsWithImages = [];
        
        for (let i = 0; i < sampleDoctors.length; i++) {
            const doctor = sampleDoctors[i];
            console.log(`\n[${i + 1}/${sampleDoctors.length}] Processing ${doctor.name} (${doctor.specialization})`);
            
            try {
                // Upload image to Cloudinary
                const uploadResult = await cloudinary.uploader.upload(doctor.imageUrl, {
                    folder: 'mediconnect/doctors',
                    public_id: `doctor-${i + 1}-${Date.now()}`,
                    transformation: [
                        { width: 400, height: 400, crop: 'fill' },
                        { quality: 'auto' }
                    ]
                });
                
                // Create doctor object with Cloudinary URL
                const doctorData = {
                    ...doctor,
                    profilePicture: uploadResult.secure_url,
                    isApproved: true,
                    status: 'active',
                    rating: {
                        average: Math.floor(Math.random() * 2) + 4, // Random rating 4-5
                        count: Math.floor(Math.random() * 100) + 50 // Random patient count
                    }
                };
                
                // Remove imageUrl field as it's not in the model
                delete doctorData.imageUrl;
                
                doctorsWithImages.push(doctorData);
                console.log(`✅ Image uploaded: ${uploadResult.secure_url}`);
                
            } catch (uploadError) {
                console.log(`⚠️  Image upload failed for ${doctor.name}, using default image`);
                const doctorData = {
                    ...doctor,
                    isApproved: true,
                    status: 'active',
                    rating: {
                        average: Math.floor(Math.random() * 2) + 4,
                        count: Math.floor(Math.random() * 100) + 50
                    }
                };
                
                // Remove imageUrl field as it's not in the model
                delete doctorData.imageUrl;
                
                doctorsWithImages.push(doctorData);
            }
        }
        
        console.log('\n💾 Saving doctors to database...');
        
        // Insert doctors into database
        const result = await Doctor.insertMany(doctorsWithImages);
        
        console.log(`\n🎉 Successfully added ${result.length} doctors!`);
        
        // Display summary
        console.log('\n📊 Sample Doctors Added:');
        result.forEach((doctor, index) => {
            console.log(`${index + 1}. ${doctor.name} - ${doctor.specialization}`);
            console.log(`   Email: ${doctor.email}`);
            console.log(`   Password: doctor123`);
            console.log(`   Consultation Fee: $${doctor.consultationFee}`);
            console.log(`   Hospital: ${doctor.hospital.name}`);
            console.log(`   Location: ${doctor.hospital.address.city}, ${doctor.hospital.address.state}`);
            console.log('');
        });
        
        console.log('🔑 All doctors use password: doctor123');
        console.log('✅ All doctors are pre-approved and active');
        console.log('\n📝 Next steps:');
        console.log('1. Start your backend server: npm start');
        console.log('2. Start your frontend: npm run dev');
        console.log('3. Register as a patient');
        console.log('4. Browse and book appointments with these doctors');
        
    } catch (error) {
        console.error('\n❌ Error adding sample doctors:', error.message);
        
        if (error.message.includes('MONGODB_URI')) {
            console.log('\n📝 Please check your MongoDB connection in backend/.env');
        } else if (error.message.includes('cloudinary')) {
            console.log('\n☁️  Please check your Cloudinary configuration');
        }
        
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed.');
    }
};

// Run the script
addSampleDoctors(); 