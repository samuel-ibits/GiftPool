import mongoose from 'mongoose';

let isConnected = false;

export const connectToDatabase = async () => {
    const MONGODB_URI = process.env.MONGODB_URL;

    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URL environment variable');
    }

    if (isConnected) return;

    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: 'gift-pool',
        });
        isConnected = true;
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
};
