import logger from "../utils/logger.js";
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.friendlyMessage || "Something went wrong";
  
    logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, {
      method: req.method,
      url: req.originalUrl,
      user: req.userInfo?._id || "Guest",
      message: err.message,
      statusCode,
      stack: err.stack,
    });
  
    res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === "development" && {
        error: err.message,
        stack: err.stack,
      }),
    });
  };
export default errorHandler;