"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// This file catches errors that happen in Server Components, Route Handlers, and during rendering.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    toast.error(error.message || "An unexpected error occurred.");
  }, [error]);

  return (
    <html>
      <body className="flex h-screen flex-col items-center justify-center gap-4 bg-background p-4 text-center">
        <h2 className="text-2xl font-semibold">Something went wrong!</h2>
        <p className="max-w-md text-muted-foreground">
          {error.message || "An unexpected error occurred."}
        </p>
        <Button onClick={() => reset()}>Try again</Button>
      </body>
    </html>
  );
}
