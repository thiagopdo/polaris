import { serve } from "inngest/next";
import { processMessage } from "@/features/conversations/inngest/process-message";
import { demoError, demoGenerate } from "@/inngest/functions";
import { inngest } from "../../../inngest/client";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [demoGenerate, demoError, processMessage],
});
