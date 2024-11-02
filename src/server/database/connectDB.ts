import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export default async function connectToDatabase() {
  const dbURI = process.env.MONGODB_URI!;

  try {
    await mongoose.connect(dbURI);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Encerra a aplicação em caso de erro
  }
}
