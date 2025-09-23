import { AdminUserModel } from "../models/clt_admin_users.js"
import AppError from "../helper/appError.helper.js";
import { generateAccessToken, generateRefreshToken } from "../lib/jwtHandler.js";

export const registerService =  async({name, email, roleId, status, password})=>{
    const result  = await AdminUserModel.create({name, email, roleId, status, passwordHash:password});
    return result;
}

export const loginService =  async({email, password})=>{

    /// Check if admin exists
    const admin = await AdminUserModel.findOne({ email }).populate("roleId");
    if (!admin) {
        throw new AppError("Invalid email or password", 401)
    }

    // Check password
    const isMatch = await admin.matchPassword(password); // use schema method
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401)
    }

    // Create JWT payload
    const tokenPayload = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: {
        id: admin.roleId._id,
        roleName: admin.roleId.roleName,
        roleKey: admin.roleId.roleKey,
        roleType: admin.roleId.roleType
      }
    };

    const authAccessToken  = generateAccessToken(tokenPayload);
    const authRefreshToken = generateRefreshToken(tokenPayload);

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    return {authAccessToken, authRefreshToken};


}