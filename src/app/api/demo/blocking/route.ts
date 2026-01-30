import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export async function POST() {
  const response = await generateText({
    model: anthropic("claude-haiku-4-5"),
    prompt: "Write a vegetarion lasagna recipe for 4 people",
  });

  return Response.json({ response });
}
