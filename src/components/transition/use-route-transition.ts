"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { type RouteKind } from "@/components/transition/transition-types";

function getRouteSegments(pathname: string | null) {
  return pathname?.split("/").filter(Boolean) ?? [];
}

export function isHomePath(pathname: string | null) {
  const segments = getRouteSegments(pathname);
  return segments.length <= 1;
}

export function getRouteKind(pathname: string | null): RouteKind {
  if (!pathname) {
    return "generic";
  }

  const segments = getRouteSegments(pathname);

  if (segments.length <= 1) {
    return "home";
  }

  const routeSegments = segments.slice(1);
  const [firstSegment, secondSegment] = routeSegments;

  if (firstSegment === "blog") {
    if (secondSegment === undefined) {
      return "blog-index";
    }

    if (secondSegment === "archive") {
      return "blog-archive";
    }

    if (secondSegment === "categories" || secondSegment === "tags") {
      return "blog-taxonomy";
    }

    return "blog-post";
  }

  if (firstSegment === "discography") {
    return "discography";
  }

  if (firstSegment === "about") {
    return "about";
  }

  if (firstSegment === "biography") {
    return "biography";
  }

  if (firstSegment === "contact") {
    return "contact";
  }

  return "generic";
}

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  return prefersReducedMotion;
}

export function useRouteTransition() {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();

  return React.useMemo(
    () => ({
      pathname,
      routeKind: getRouteKind(pathname),
      isHomeRoute: isHomePath(pathname),
      prefersReducedMotion,
    }),
    [pathname, prefersReducedMotion],
  );
}

