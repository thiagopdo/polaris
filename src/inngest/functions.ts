import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { inngest } from "./client";

export const demoGenerate = inngest.createFunction(
  { id: "demo-generate" },
  { event: "demo/generate" },
  async ({ step }) => {
    await step.run("generate-text", async () => {
      return await generateText({
        model: anthropic("claude-haiku-4-5"),
        prompt: "Write a vegetarion lasagna recipe for 4 people",
      });
    });
  },
);
