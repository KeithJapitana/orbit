import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export const claudeModel = anthropic("claude-sonnet-4-5-20250929");

export async function generateAIResponse(prompt: string, system?: string) {
  const { text } = await generateText({
    model: claudeModel,
    prompt,
    system,
  });
  return text;
}
