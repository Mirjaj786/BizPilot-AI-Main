import { generateResponse } from "./services/aiServices.js";

async function main() {
  const response = await generateResponse("Say Hello");
  console.log("AI Response:\n", response);
}

main().catch(console.error);
