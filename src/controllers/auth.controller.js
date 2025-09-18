import asyncHandler from "../middlewares/asyncHandler.js";
import * as authService from "../services/auth.service.js"
import responseHelper from "../helper/response.helper.js";
import { ENV } from "../config/env.js";

export const loginUser = asyncHandler(async (req, res)=>{
    const result = authService.loginService();

    const cookieOptions = {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production", // only true in production
        sameSite: ENV.NODE_ENV === "production" ? "None" : "Lax", // None for cross-domain
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie("AccessToken", result.sfAccessToken, cookieOptions);
    res.cookie("RefreshToken", result.scRefreshToken, cookieOptions);

    return responseHelper.created(res, "Login successfully", result);
});