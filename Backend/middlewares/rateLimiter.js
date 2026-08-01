import ApiError from "../utils/apiError.js";
import httpStatus from "http-status";

const rateLimitMap = new Map();

export const aiRateLimiter = (maxRequests = 10, windowMs = 60 * 1000) => {
  return (req, res, next) => {
    const key = req.user?._id?.toString() || req.ip || "global_ai_user";
    const now = Date.now();

    if (!rateLimitMap.has(key)) {
      rateLimitMap.set(key, []);
    }

    const timestamps = rateLimitMap.get(key).filter((t) => now - t < windowMs);

    if (timestamps.length >= maxRequests) {
      throw new ApiError(
        httpStatus.TOO_MANY_REQUESTS,
        "AI rate limit reached. Please wait a minute before sending another prompt."
      );
    }

    timestamps.push(now);
    rateLimitMap.set(key, timestamps);
    next();
  };
};
