import mongoose from 'mongoose';

let isConnected: boolean = false;

/**
 * Connects to the MongoDB database using Mongoose.
 **/
export default async function connectToDatabase(): Promise<void> {
  if (isConnected) {
    console.log('Database connection already established');
    return;
  }

  try {
    const dbURI = process.env.MONGODB_URI!;
    await mongoose.connect(dbURI);
    isConnected = true;
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
}
