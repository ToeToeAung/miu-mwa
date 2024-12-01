import mongoose from 'mongoose';

const dbURL = process.env.MONGO_URL;
export const connectDB = async () => {
  try {
    await mongoose.connect(dbURL || '');
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
