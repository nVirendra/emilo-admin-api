import multer from "multer";
import responseHelper from "../helper/response.helper.js";
import AppError from "../helper/appError.helper.js";

const storage = multer.memoryStorage();

const limits = {
  fileSize: 50 * 1024 * 1024, // 50MB
};

const allowedTypes = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  // Videos
  "video/mp4",
  "video/mkv",
  "video/quicktime",
  "video/3gp",
  "video/webm",
  "video/mpeg",
  // Audio
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/webm",
  "audio/ogg",
];

const fileFilter = (req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new AppError("Only image, video and audio files are allowed.", 400));
  }
  cb(null, true);
};

//  Common multer instance
const multerUpload = multer({ storage, limits, fileFilter });

/**
 * Handle Single File Upload
 * @param {string} fieldName
 */
export const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    multerUpload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return responseHelper.error(res, "File must be under 50MB.", 400);
        }
        return responseHelper.error(res, `Multer error: ${err.message}`, 400);
      } else if (err) {
        return responseHelper.error(res, err.message, 400);
      }
      next();
    });
  };
};

/**
 * Handle Multiple Files Upload (same field)
 * @param {string} fieldName
 * @param {number} maxCount
 */
export const uploadArray = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    multerUpload.array(fieldName, maxCount)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return responseHelper.error(res, "Each file must be under 50MB.", 400);
        }
        return responseHelper.error(res, `Multer error: ${err.message}`, 400);
      } else if (err) {
        return responseHelper.error(res, err.message, 400);
      }
      next();
    });
  };
};

/**
 * Handle Multiple Fields Upload
 * @param {Array} fields
 */
export const uploadFields = (fields) => {
  return (req, res, next) => {
    multerUpload.fields(fields)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return responseHelper.error(res, "Each file must be under 50MB.", 400);
        }
        return responseHelper.error(res, `Multer error: ${err.message}`, 400);
      } else if (err) {
        return responseHelper.error(res, err.message, 400);
      }
      next();
    });
  };
};