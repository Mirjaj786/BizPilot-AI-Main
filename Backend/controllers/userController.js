import User from "../models/userModel.js";
import AsyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import httpStatus from "http-status";
import { genarateToken } from "../utils/createToken.js";

export const register = AsyncHandler(async (req, res) => {
  const { fullName, email, password, businessName, businessType } = req.body;

  if (!fullName || !email || !password || !businessName || !businessType) {
    throw new ApiError(httpStatus.BAD_REQUEST, "All fields are required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!validator.isEmail(normalizedEmail)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid email address");
  }

  if (!validator.isLength(password, { min: 8 })) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password must be at least 8 characters.",
    );
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "User already exists");
  }

  const hashPass = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    password: hashPass,
    businessName: businessName.trim(),
    businessType,
  });

  const token = genarateToken(newUser._id);

  const user = {
    id: newUser._id,
    fullName: newUser.fullName,
    email: newUser.email,
    businessName: newUser.businessName,
    businessType: newUser.businessType,
  };

  return res.status(httpStatus.CREATED).json(
    new ApiResponse({
      message: "User registered successfully",
      data: {
        user,
        token,
      },
    }),
  );
});

export const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Email and Password are Required!",
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User Not Found!");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Wrong Email or Password!");
  }

  const token = genarateToken(user._id);
  return res.status(httpStatus.OK).json(
    new ApiResponse({
      message: "Welcome Back to BizFlow!",
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          businessName: user.businessName,
          businessType: user.businessType,
        },
      },
    }),
  );
});

export const getMe = AsyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please login first!");
  }

  const userData = await User.findById(userId).select("-password");
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, " User not Found!");
  }

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      success: true,
      message: "User profile fetched successfully.",
      data: userData,
    }),
  );
});

export const logout = AsyncHandler(async (req, res) => {
  return res.status(httpStatus.OK).json(
    new ApiResponse({
      success: true,
      message: "Logged out successfully.",
    }),
  );
});