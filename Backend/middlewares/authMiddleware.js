import jwt from "jsonwebtoken";
import httpStatus from "http-status";

import User from "../models/userModel.js";
import AsyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

export const authMiddleware = AsyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Access denied. Please login first.",
    );
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired token.");
  }

  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User no longer exists.");
  }

  req.user = user;

  next();
});
