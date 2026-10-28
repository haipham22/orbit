"use client";

import { RouteError } from "@/components/layout/route-error";

// Route error boundary (khuôn dùng chung ở components/layout/route-error.tsx).
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError reset={reset} />;
}
