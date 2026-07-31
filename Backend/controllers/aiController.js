import AsyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import httpStatus from "http-status";
import { chatWithBusinessAI } from "../services/aiServices.js";

export const chatWithAI = AsyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized access. Please login.");
  }

  const { message } = req.body;

  if (!message || !message.trim()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Message is required.");
  }

  const response = await chatWithBusinessAI(userId, message.trim());

  return res.status(httpStatus.OK).json(
    new ApiResponse({
      message: "AI response generated successfully",
      data: { response },
    })
  );
});