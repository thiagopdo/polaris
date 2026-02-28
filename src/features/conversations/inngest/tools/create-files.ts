import { createTool } from "@inngest/agent-kit";
import { z } from "zod";
import { convex } from "@/lib/convex-client";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";

interface CreateFilesToolOptions {
  projectId: Id<"projects">;
  internalKey: string;
}

const paramsSchema = z.object({
  parentId: z.string(),
  files: z
    .array(
      z.object({
        name: z.string().min(1, "File name cannot be empty"),
        content: z.string(),
      }),
    )
    .min(1, "At least one file must be provided"),
});

export const createCreateFilesTool = ({
  internalKey,
  projectId,
}: CreateFilesToolOptions) => {
  return createTool({
    name: "createFiles",
    description:
      "Create multiple files at once under a specified parent folder. Use this to batch create files that share the same parent folder. More efficient than calling createFiles multiple times for individual files.",
    parameters: z.object({
      parentId: z
        .string()
        .describe(
          "ID of the parent folder where the files will be created. Use 'root' for the root folder. Must be a valid ID from the listFiles",
        ),
      files: z
        .array(
          z.object({
            name: z.string().describe("Name of the file to be created"),
            content: z.string().describe("Content of the file to be created"),
          }),
        )
        .describe("Array of files to be created with their names and content"),
    }),

    handler: async (params, { step: toolStep }) => {
      const parsed = paramsSchema.safeParse(params);
      if (!parsed.success) {
        return `Error: ${parsed.error.issues[0].message}`;
      }

      const { parentId, files } = parsed.data;

      try {
        return await toolStep?.run("create-files", async () => {
          let resolvedParentId: Id<"files"> | undefined;

          if (parentId && parentId !== "") {
            try {
              resolvedParentId = parentId as Id<"files">;
              const parentFolder = await convex.query(api.system.getFileById, {
                internalKey,
                fileId: resolvedParentId,
              });

              if (!parentFolder) {
                return `Error: Parent folder with Id "${parentId}" not found. Use listFiles to get valid folders IDs.`;
              }
              if (parentFolder.type !== "folder") {
                return `Error: Parent ID "${parentId}" is not a folder. Use listFiles to get valid folders IDs.`;
              }
            } catch {
              return `Error: Invalid parentId "${parentId}". Use listFiles to get valid folders IDs.`;
            }
          }

          const results = await convex.mutation(api.system.createFiles, {
            internalKey,
            projectId,
            parentId: resolvedParentId,
            files,
          });

          const created = results.filter((r) => !r.error);
          const failed = results.filter((r) => r.error);

          let response = `Created ${created.length} file(s)`;
          if (created.length > 0) {
            response += `: ${created.map((r) => r.name).join(", ")}`;
          }
          if (failed.length > 0) {
            response += `. Failed: ${failed.map((r) => `${r.name} (${r.error})`).join(", ")}`;
          }

          return response;
        });
      } catch (error) {
        return `Error creating files: ${error instanceof Error ? error.message : "Unknown error"}`;
      }
    },
  });
};
