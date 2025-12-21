import mongoose from "mongoose";
import { DOTENV } from "./dotenv.js";

// Temporary dev workaround for TLS handshake issues
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

if (!DOTENV.DB_URL) {
  console.log("No url");
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DOTENV.DB_URL);
    console.log("✅ MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("❌ Error connecting to DB:", error.message);
    process.exit(1);
  }
};
