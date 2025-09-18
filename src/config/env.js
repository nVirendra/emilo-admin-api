import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "local",
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "",
};
