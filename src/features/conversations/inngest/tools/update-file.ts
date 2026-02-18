import { createTool } from "@inngest/agent-kit";
import z from "zod";
import { convex } from "@/lib/convex-client";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";

interface UpdateFileToolOptions {
  internalKey: string;
}

const paramsSchema = z.object({
  fileId: z.string().min(1, "File ID cannot be empty"),
  content: z.string(),
});

export const createUpdateFileTool = ({
  internalKey,
}: UpdateFileToolOptions) => {
  return createTool({
    name: "updateFile",
    description: "Update the content of an existing file.",
    parameters: z.object({
      fileId: z.string().describe("ID of the file to update"),
      content: z.string().describe("New content for the file"),
    }),

    handler: async (params, { step: toolStep }) => {
      const parsed = paramsSchema.safeParse(params);

      if (!parsed.success) {
        return `Error: ${parsed.error.issues[0].message}`;
      }

      const { fileId, content } = parsed.data;

      //validate file exists before updating
      const existingFile = await convex.query(api.system.getFileById, {
        internalKey,
        fileId: fileId as Id<"files">,
      });

      if (!existingFile) {
        return `Error: file with ID ${fileId} not found. use listFiles tool to get the list of available files and their IDs.`;
      }

      if (existingFile?.type === "folder") {
        return `Error: file with ID ${fileId} is a folder. Only files can be updated. use listFiles tool to get the list of available files and their IDs.`;
      }

      try {
        return await toolStep?.run("update-files", async () => {
          await convex.mutation(api.system.updateFile, {
            internalKey,
            fileId: fileId as Id<"files">,
            content,
          });

          return `File ${existingFile?.name} (ID: ${fileId}) updated successfully.`;
        });
      } catch (error) {
        return `Error updating files: ${error instanceof Error ? error.message : String(error)}`;
      }
    },
  });
};
