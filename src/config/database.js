import mongoose from 'mongoose';
import { ENV } from './env.js';

const connectDB = async () => {
  const uri = ENV.MONGO_URI;
  try {
    await mongoose.connect(uri)
    console.log(' MongoDB connected successfully');
  } catch (err) {
    console.error(' MongoDB connection failed:', err);
    process.exit(1); // Optional: exit if DB fails
  }
};

export default connectDB;
