"use client";

import { useAuth } from "@clerk/nextjs";
import * as Sentry from "@sentry/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DemoPage() {
  const { userId } = useAuth();

  const [loading, setLoading] = useState(false);
  const [loadingBackground, setLoadingBackground] = useState(false);

  const handleBlocking = async () => {
    setLoading(true);
    await fetch("/api/demo/blocking", { method: "POST" });
    setLoading(false);
  };

  const handleBackground = async () => {
    setLoadingBackground(true);
    await fetch("/api/demo/background", { method: "POST" });
    setLoadingBackground(false);
  };

  const handleClientError = async () => {
    Sentry.logger.info("User attemping to click on client function", {
      userId,
    });
    throw new Error("Client error");
  };

  const handleApiError = async () => {
    await fetch("/api/demo/error", { method: "POST" });
  };

  const handleInngestError = async () => {
    await fetch("/api/demo/inngest-error", { method: "POST" });
  };

  return (
    <div className="p-8 space-xs-4">
      <Button disabled={loading} onClick={handleBlocking}>
        {loading ? "Loading..." : "Generate"}
      </Button>
      <Button disabled={loadingBackground} onClick={handleBackground}>
        {loadingBackground ? "Loading..." : "Generate Background"}
      </Button>
      <Button variant="destructive" onClick={handleClientError}>
        Client Error
      </Button>
      <Button variant="destructive" onClick={handleApiError}>
        API Error
      </Button>
      <Button variant="destructive" onClick={handleInngestError}>
        Inngest Error
      </Button>
    </div>
  );
}
