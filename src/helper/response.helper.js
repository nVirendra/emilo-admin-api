import logger from "../utils/logger.js";

const sendResponse = (
  res,
  statusCode,
  success,
  message,
  data = null,
  extra = {}
) => {
  const response = {
    status: success,
    message,
    ...extra, // <— allow top-level extras like count, pagination, etc.
  };
  if (data !== null) {
    response.data = data;
  }

  // Log the response details
  logger.info(`${res.req.method} ${res.req.originalUrl} - ${message}`, {
    method: res.req.method,
    url: res.req.originalUrl,
    user: res.req.userInfo?._id || "Guest",
    statusCode,
    response,
  });

  return res.status(statusCode).json(response);
};

const success = (res, message = "Success", data = null, code = 200) => {
  return sendResponse(res, code, true, message, data);
};

const created = (
  res,
  message = "Resource created successfully",
  data = null
) => {
  return sendResponse(res, 201, true, message, data);
};

const error = (res, message = "Something went wrong", code = 500) => {
  return sendResponse(res, code, false, message);
};

const notFound = (res, message = "Resource not found") => {
  return sendResponse(res, 404, false, message);
};

const unauthorized = (res, message = "Unauthorized access") => {
  return sendResponse(res, 401, false, message);
};

const conflict = (res, message = "Conflict resource exists") => {
  return sendResponse(res, 409, false, message);
};

const rateLimitExceeded = (res, message = "Rate limit exceeded") => {
  return sendResponse(res, 429, false, message);
};
/** ---------- New helpers so you don't have to return 404 for "no data" ---------- **/

// Always returns 200 with an array and a top-level count
const list = (res, items = [], message = "Fetched successfully") => {
  const normalized = Array.isArray(items) ? items : items ? [items] : [];
  return sendResponse(res, 200, true, message, normalized, {
    count: normalized.length,
  });
};

// Returns 200 with data: [] and count: 0
const empty = (res, message = "No data found") => {
  return sendResponse(res, 200, true, message, []);
};

// Convenience: decides between `list` and `empty`
const listOrEmpty = (
  res,
  items,
  { ok = "Fetched successfully", emptyMsg = "No data found" } = {}
) => {
  if (Array.isArray(items) && items.length) return list(res, items, ok);
  return empty(res, emptyMsg);
};

export default {
  success,
  created,
  error,
  notFound,
  rateLimitExceeded,
  unauthorized,
  conflict,
  list,
  empty,
  listOrEmpty,
};
