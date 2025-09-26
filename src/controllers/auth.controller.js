import asyncHandler from "../middlewares/asyncHandler.js";
import * as authService from "../services/auth.service.js"
import responseHelper from "../helper/response.helper.js";
import { ENV } from "../config/env.js";

export const registerUser = asyncHandler(async (req, res)=>{
    const {name, email, roleId, status, password} = req.body;
    const result = await authService.registerService({name, email, roleId, status, password});
    return responseHelper.created(res, "Register successfully", result);
});


export const loginUser = asyncHandler(async (req, res)=>{
    const { email, password } = req.body;

    const result = await authService.loginService({email, password});

    const cookieOptions = {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production", // only true in production
        sameSite: ENV.NODE_ENV === "production" ? "None" : "Lax", // None for cross-domain
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie("authAccessToken", result.authAccessToken, cookieOptions);
    res.cookie("authRefreshToken", result.authRefreshToken, cookieOptions);

    return responseHelper.success(res, "Login successfully", result);
});

export const logoutUser = asyncHandler(async (req, res) => {
  // Clear auth cookies
  res.clearCookie("authAccessToken", {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production", // only true in production
    sameSite: ENV.NODE_ENV === "production" ? "None" : "Lax", // None for cross-domain
  });

  res.clearCookie("authRefreshToken", {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production", // only true in production
    sameSite: ENV.NODE_ENV === "production" ? "None" : "Lax", // None for cross-domain
  });

  return responseHelper.success(res, "Logout successful");
});


// controllers/auth.controller.js
export const getMe = asyncHandler(async (req, res) => {
  // req.user is set by `protect` middleware
  return responseHelper.success(res, "User fetched successfully", req.user);
});
