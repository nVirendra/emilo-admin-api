import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const generateAccessToken = (payload) => {
  const accessToken = jwt.sign(
    {
      emiloUserId: payload.emiloUserId,
      scProfileId: payload.scProfileId,
    },
    ENV.JWT_ACCESS_PASS_KEY,
    { expiresIn: "15" }
  );
  return accessToken;
};

export const generateRefreshToken = (payload) => {
  const refreshToken = jwt.sign(
    {
      emiloUserId: payload._id,
      scProfileId: payload._id,
    },
    ENV.JWT_REFRESH_PASS_KEY,
    { expiresIn: "7d" }
  );
  return refreshToken;
};