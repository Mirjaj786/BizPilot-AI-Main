import groq from "../config/groq.js";
import { buildBusinessService } from "./businessContextService.js";
import { createBusinessPrompt } from "./promptService.js";
import ApiError from "../utils/apiError.js";
import httpStatus from "http-status";

export const generateResponse = async (prompt) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content?.trim() || "No response generated.";
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `AI Service Error: ${error.message || "Failed to generate AI response"}`
    );
  }
};

export const chatWithBusinessAI = async (userId, message) => {
  const businessData = await buildBusinessService(userId, message);
  const prompt = createBusinessPrompt(businessData, message);
  return await generateResponse(prompt);
};
