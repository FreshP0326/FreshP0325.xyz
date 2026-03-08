"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 可以将错误日志发送到错误报告服务
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center px-4">
      <div className="rounded-full bg-destructive/10 p-6">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground max-w-md">
          An unexpected error has occurred. Please try again later.
        </p>
      </div>
      <Button onClick={reset} variant="outline" className="rounded-full px-8">
        Try again
      </Button>
    </div>
  );
}