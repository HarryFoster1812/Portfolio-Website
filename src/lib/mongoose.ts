import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
    console.log("Error: MONGO_URI is not defined in the environment variables")
  throw new Error('Please define the MONGO_URI environment variable');
}

let isConnected = false;

export async function connectDB() {
  if (isConnected || mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('MongoDB connection failed');
  }
}
