import dotenv from "dotenv";

dotenv.config();

export const DOTENV = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  DB_URL: process.env.DB_URL,
};
