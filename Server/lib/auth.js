// lib/auth.js
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectDB } from "./DB.js";
import mongoose, { trusted } from "mongoose";
import { DOTENV } from "./dotenv.js";

const trustedOrigins = DOTENV.TRUSTED_ORIGINS;
let authInstance = null;

/**
 * Initialize and get the auth instance
 */
export const initializeAuth = async () => {
  if (authInstance) {
    return authInstance;
  }

  try {
    // Ensure database is connected
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const nativeDb = mongoose.connection.db;

    authInstance = betterAuth({
      database: mongodbAdapter(nativeDb, {
        client: mongoose.connection.getClient(),
      }),
      secret: DOTENV.BETTER_AUTH_SECRET,
      baseURL: DOTENV.BETTER_AUTH_URL,
      trustedOrigins: DOTENV.TRUSTED_ORIGINS,
      emailAndPassword: {
        enabled: true,
      },

      user: {
        deleteUser: {
          enabled: true,
        },
      },
      advanced: {
        session: {
          name: "auth_session",
          expiresIn: 60 * 60 * 24 * 7, // 7 days
          updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
          attributes: {
            httpOnly: true,
            secure: DOTENV.NODE_ENV === "production",
            sameSite: "none",
            path: "/",
          },
        },
      },
    });

    console.log("✅ Better Auth initialized successfully");
    return authInstance;
  } catch (error) {
    console.error("❌ Failed to initialize Better Auth:", error);
    throw error;
  }
};

export const getAuth = () => {
  if (!authInstance) {
    throw new Error("Auth not initialized. Call initializeAuth() first.");
  }
  return authInstance;
};
