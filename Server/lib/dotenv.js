import dotenv from "dotenv";

dotenv.config();

export const DOTENV = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,

  DB_URL: process.env.DB_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  TRUSTED_ORIGINS: process.env.TRUSTED_ORIGINS,
};
