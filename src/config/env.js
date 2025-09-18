import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "local",
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_ACCESS_PASS_KEY: process.env.JWT_ACCESS_PASS_KEY,
  JWT_REFRESH_PASS_KEY: process.env.JWT_REFRESH_PASS_KEY,
};
