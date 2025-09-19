import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const generateAccessToken = (payload) => {
  const accessToken = jwt.sign(payload, ENV.JWT_ACCESS_PASS_KEY,{ expiresIn: "15" });
  return accessToken;
};

export const generateRefreshToken = (payload) => {
  const refreshToken = jwt.sign(payload, ENV.JWT_REFRESH_PASS_KEY,{ expiresIn: "7d" });
  return refreshToken;
};
