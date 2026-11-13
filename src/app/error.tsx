"use client";

import { useEffect } from "react";
import ErrorsD from "@/design/errors/ErrorsD";

// A page crashed while rendering (500). Inside the root layout, so the header, footer and language still work.
// "Try again" re-renders the page with reset() instead of a full reload.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return <ErrorsD code="500" onRetry={reset} />;
}
