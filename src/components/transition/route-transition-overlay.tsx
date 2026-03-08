"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { usePrefersReducedMotion } from "@/components/transition/use-route-transition";

const ENTERING_MS = 260;

function clearSnapshot() {
  const snapshotHost = document.getElementById("route-transition-snapshot");

  if (!snapshotHost) {
    return;
  }

  snapshotHost.replaceChildren();
  document.documentElement.dataset.routeTransitionHasSnapshot = "false";
}

export function RouteTransitionOverlay() {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    const root = document.documentElement;

    if (prefersReducedMotion) {
      root.dataset.routeTransitionState = "idle";
      clearSnapshot();
      return;
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      root.dataset.routeTransitionState = "idle";
      clearSnapshot();
      return;
    }

    root.dataset.routeTransitionState = "entering";
    const timer = window.setTimeout(() => {
      root.dataset.routeTransitionState = "idle";
      clearSnapshot();
    }, ENTERING_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname, prefersReducedMotion]);

  return (
    <div id="route-transition-overlay" aria-hidden="true">
      <div id="route-transition-snapshot" />
      <div id="route-transition-veil" />
      <div id="route-transition-bar">
        <span id="route-transition-bar-inner" />
      </div>
    </div>
  );
}
