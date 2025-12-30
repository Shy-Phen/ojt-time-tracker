import mongoose from "mongoose";
import { DOTENV } from "./dotenv.js";

if (!DOTENV.DB_URL) {
  console.log("No DB_URL found in environment variables");
  process.exit(1);
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log("✅ MongoDB connected:", conn.connection.host);
    return conn;
  } catch (error) {
    console.error("❌ Error connecting to DB:", error.message);
    process.exit(1);
  }
};
