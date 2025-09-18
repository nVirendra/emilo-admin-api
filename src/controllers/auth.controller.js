import asyncHandler from "../middlewares/asyncHandler.js";
import * as authService from "../services/auth.service.js"
import responseHelper from "../helper/response.helper.js";


export const loginUser = asyncHandler(async (req, res)=>{
    const result = authService.loginService();
    return responseHelper.created(res, "Login successfully", result);
});