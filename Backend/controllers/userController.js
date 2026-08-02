import User from "../models/userModel.js";
import AsyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import httpStatus from "http-status";
import { genarateToken } from "../utils/createToken.js";
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../utils/sendEmail.js";
import { buildResetEmail, resetPasswordSubject } from "../utils/buildResetEmail.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

export const googleLogin = AsyncHandler(async (req, res) => {
  const { credential, token: inputToken } = req.body;
  const targetToken = credential || inputToken;

  if (!targetToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Google credential token is required");
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: targetToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (error) {
    console.error("Google token verification error:", error.message);
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired Google token");
  }

  const { email, name, sub: googleId } = payload;
  const normalizedEmail = email.trim().toLowerCase();

  let user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const dummyPassword = await bcrypt.hash(googleId + (process.env.JWT_SECRET || "google_secret"), 10);
    user = await User.create({
      fullName: name?.trim() || "Google Merchant",
      email: normalizedEmail,
      password: dummyPassword,
      businessName: `${(name?.split(' ')[0]) || 'My'}'s Retail Store`,
      businessType: "Retail",
    });
  }

  const token = genarateToken(user._id);

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      message: "Google login successful",
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

export const forgotPassword = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email address is required.");
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!validator.isEmail(normalizedEmail)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please enter a valid email address.");
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No account registered with this email address.");
  }

  const passResetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const passResetLink = `${frontendUrl}/reset-password/${passResetToken}`;

  const htmlContent = buildResetEmail(user.fullName, passResetLink);

  await sendEmail({
    to: user.email,
    subject: resetPasswordSubject,
    html: htmlContent,
  });

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      message: "Password reset link has been sent to your email. Please check your inbox.",
    }),
  );
});

export const resetPassword = AsyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword, password } = req.body;
  const targetPassword = newPassword || password;

  if (!token) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Reset token is required.");
  }

  if (!targetPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "New password is required.");
  }

  if (!validator.isLength(targetPassword, { min: 8 })) {
    throw new ApiError(httpStatus.BAD_REQUEST, "New password must be at least 8 characters long.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Reset token verification error:", error.message);
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset link is invalid or has expired. Please request a new link.");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User account not found.");
  }

  const hashPass = await bcrypt.hash(targetPassword, 10);
  user.password = hashPass;
  await user.save();

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      message: "Password reset successful! You can now log in with your new password.",
    }),
  );
});