"use client";

import * as React from "react";

import { useRouteTransition } from "@/components/transition/use-route-transition";

interface InnerPageTransitionProps {
  children: React.ReactNode;
}

export function InnerPageTransition({ children }: InnerPageTransitionProps) {
  const { isHomeRoute, pathname, prefersReducedMotion, routeKind } = useRouteTransition();
  const [transitionStage, setTransitionStage] = React.useState<"entering" | "idle">(
    prefersReducedMotion ? "idle" : "entering",
  );

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setTransitionStage("idle");
      return;
    }

    setTransitionStage("entering");
    const timeout = window.setTimeout(() => {
      setTransitionStage("idle");
    }, 280);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [pathname, prefersReducedMotion]);

  if (isHomeRoute) {
    return children;
  }

  return (
    <div
      data-page-shell="true"
      data-pathname={pathname ?? ""}
      data-reduced-motion={prefersReducedMotion ? "true" : "false"}
      data-route-kind={routeKind}
      data-transition-stage={transitionStage}
    >
      <div data-transition-layer="frame">{children}</div>
    </div>
  );
}
