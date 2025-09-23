
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { AdminUserModel } from "../models/clt_admin_users.js";
import responseHelper from "../helper/response.helper.js";

export const protect = async (req, res, next) => {
  try {

    const token = req.cookies?.authAccessToken;
    if (!token) {
        return responseHelper.error(res,"Not authorized, token missing", 401);
    }

    console.log('token:', token)

    const decoded = jwt.verify(token, ENV.JWT_ACCESS_PASS_KEY);

    // Attach user to request
    req.user = decoded;

    // Optional: Fetch fresh user from DB to check status
    const admin = await AdminUserModel.findById(decoded.id).populate("roleId");
    if (!admin || admin.status !== "Active") {
        return responseHelper.error(res,"Account inactive or not found", 403);
    }

    next();
  } catch (err) {
    // console.error(res,"Auth error:", err.message);
    return responseHelper.error(res,"Not authorized, token invalid", 401);
  }
};


export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user?.role?.roleKey) {
        return responseHelper.error(res,"Role not assigned", 403);
    }

    if (!allowedRoles.includes(req.user.role.roleKey)) {
        return responseHelper.error(res, "Forbidden: insufficient role", 403);
    }

    next();
  };
};