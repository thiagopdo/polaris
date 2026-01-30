"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DemoPage() {
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

  return (
    <div>
      <Button disabled={loading} onClick={handleBlocking}>
        {loading ? "Loading..." : "Generate"}
      </Button>
      <Button disabled={loadingBackground} onClick={handleBackground}>
        {loadingBackground ? "Loading..." : "Generate Background"}
      </Button>
    </div>
  );
}
