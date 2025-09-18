import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

// Define log format
const logFormat = format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}] ${message}${stack ? `\nStack: ${stack}` : ''}`;
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console(),

    // Daily log file by date (e.g., 20-07-2025.log)
    new DailyRotateFile({
      filename: path.join("logs", "%DATE%.log"), // logs/20-07-2025.log
      datePattern: "DD-MM-YYYY",
      zippedArchive: false,
      maxSize: "20m",
      maxFiles: "14d", // Keep logs for 14 days
      level: "info",
    }),
  ],
});

export default logger;
