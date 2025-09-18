import logger from '../utils/logger.js'; 

class AppError extends Error {
  constructor(friendlyMessage, statusCode = 500) {
    super(friendlyMessage);
    this.statusCode = statusCode;
    this.friendlyMessage = friendlyMessage;
    Error.captureStackTrace(this, this.constructor);
    if (process.env.NODE_ENV === 'development') {
      logger.warn(`AppError Created: ${message}`, {
        statusCode,
        friendlyMessage: this.friendlyMessage,
        stack: this.stack,
      });
    }
  }
}

export default AppError;
