import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export default async function connectToDatabase() {
  const dbURI = process.env.MONGODB_URI!;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // 5 segundos de timeout para a seleção do servidor
  };

  try {
    await mongoose.connect(dbURI, options);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Encerra a aplicação em caso de erro
  }
}
