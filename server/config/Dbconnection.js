import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const DBconnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connection succesfull");
  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1);
  }
};
