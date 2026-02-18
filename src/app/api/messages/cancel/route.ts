import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";

const requestSchema = z.object({
  projectId: z.string(),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { projectId } = requestSchema.parse(body);

  const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;
  if (!internalKey) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }

  //find all processing msgs in this project and cancel them
  const processingMessages = await convex.query(
    api.system.getProcessingMessages,
    {
      internalKey,
      projectId: projectId as Id<"projects">,
    },
  );
  if (processingMessages.length === 0) {
    return NextResponse.json({ message: "No processing messages to cancel" });
  }

  //Cancel each processing message
  const cancelledIds = await Promise.all(
    processingMessages.map(async (msg) => {
      await inngest.send({
        name: "message/cancel",
        data: {
          messageId: msg._id,
        },
      });

      await convex.mutation(api.system.updateMessageStatus, {
        internalKey,
        messageId: msg._id,
        status: "failed",
      });

      return msg._id;
    }),
  );

  return NextResponse.json({
    success: true,
    failed: true,
    messageIds: cancelledIds,
  });
}
