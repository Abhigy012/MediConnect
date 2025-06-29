import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        
        if (!mongoURI) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }

        const hasDatabaseName = mongoURI.includes('/') && !mongoURI.endsWith('/');
        const connectionString = hasDatabaseName ? mongoURI : `${mongoURI}/mediconnect`;

        console.log('Connecting to MongoDB...');

        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB Connected Successfully');
            console.log('Database:', mongoose.connection.name);
            console.log('Host:', mongoose.connection.host);
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

        await mongoose.connect(connectionString, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error.