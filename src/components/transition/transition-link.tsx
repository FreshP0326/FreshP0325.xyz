"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { startRouteTransition } from "@/components/transition/start-route-transition";
import {
  type TransitionBehavior,
  type TransitionGroup,
} from "@/components/transition/transition-types";

export type TransitionLinkProps = React.ComponentProps<typeof Link> & {
  transitionBehavior?: TransitionBehavior;
  transitionGroup?: TransitionGroup;
};

function isModifiedEvent(event: React.MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function isExternalHref(href: string) {
  return /^(?:[a-z]+:)?\/\//i.test(href) || /^(?:mailto:|tel:|javascript:|data:|tencent:)/i.test(href);
}

function normalizeUrlObject(
  href: Exclude<TransitionLinkProps["href"], string>,
) {
  const pathname = typeof href.pathname === "string" ? href.pathname : "";
  const searchParams = new URLSearchParams();

  if (href.query) {
    Object.entries(href.query).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          searchParams.append(key, String(item));
        });
        return;
      }

      searchParams.append(key, String(value));
    });
  }

  const search = searchParams.toString();
  const hash = href.hash ? `#${href.hash}` : "";
  return `${pathname}${search ? `?${search}` : ""}${hash}`;
}

function getHrefValue(href: TransitionLinkProps["href"]) {
  return typeof href === "string" ? href : normalizeUrlObject(href);
}

function shouldSkipTransition(options: {
  currentPathname: string;
  href: string;
  target?: string;
  download?: string | boolean;
  transitionBehavior: TransitionBehavior;
}) {
  const { currentPathname, download, href, target, transitionBehavior } = options;

  if (transitionBehavior === "none") {
    return true;
  }

  if (target === "_blank" || download) {
    return true;
  }

  if (isExternalHref(href)) {
    return true;
  }

  if (href.startsWith("#")) {
    return true;
  }

  const resolvedUrl = new URL(href, window.location.origin);
  const resolvedHref = href.startsWith("/")
    ? href
    : `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
  const nextUrl = new URL(resolvedHref, window.location.origin);

  if (transitionBehavior === "auto" && nextUrl.pathname === currentPathname && nextUrl.hash) {
    return true;
  }

  return false;
}

export const TransitionLink = React.forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink(
    {
      children,
      download,
      href,
      onFocus,
      onClick,
      onMouseEnter,
      onTouchStart,
      replace,
      scroll,
      target,
      transitionBehavior = "auto",
      transitionGroup = "page",
      ...props
    },
    ref,
  ) {
    const pathname = usePathname();
    const router = useRouter();

    const prefetchTarget = React.useCallback(() => {
      const hrefValue = getHrefValue(href);

      if (!hrefValue || shouldSkipTransition({ currentPathname: pathname, download, href: hrefValue, target, transitionBehavior })) {
        return;
      }

      void router.prefetch(hrefValue);
    }, [download, href, pathname, router, target, transitionBehavior]);

    React.useEffect(() => {
      const root = document.documentElement;
      delete root.dataset.routeTransitionGroup;
    }, [pathname]);

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);

        if (event.defaultPrevented || isModifiedEvent(event)) {
          return;
        }

        const hrefValue = getHrefValue(href);

        if (
          !hrefValue ||
          shouldSkipTransition({
            currentPathname: pathname,
            download,
            href: hrefValue,
            target,
            transitionBehavior,
          })
        ) {
          return;
        }

        event.preventDefault();
        document.documentElement.dataset.routeTransitionGroup = transitionGroup;
        prefetchTarget();

        startRouteTransition(() => {
          const nextHref = getHrefValue(href);

          if (!nextHref) {
            return;
          }

          if (replace) {
            router.replace(nextHref, { scroll });
            return;
          }

          router.push(nextHref, { scroll });
        });
      },
      [download, href, onClick, pathname, prefetchTarget, replace, router, scroll, target, transitionBehavior, transitionGroup],
    );

    const handleMouseEnter = React.useCallback(
      (event: React.MouseEvent<HTMLAnchorElement>) => {
        onMouseEnter?.(event);
        prefetchTarget();
      },
      [onMouseEnter, prefetchTarget],
    );

    const handleFocus = React.useCallback(
      (event: React.FocusEvent<HTMLAnchorElement>) => {
        onFocus?.(event);
        prefetchTarget();
      },
      [onFocus, prefetchTarget],
    );

    const handleTouchStart = React.useCallback(
      (event: React.TouchEvent<HTMLAnchorElement>) => {
        onTouchStart?.(event);
        prefetchTarget();
      },
      [onTouchStart, prefetchTarget],
    );

    return (
      <Link
        data-transition-behavior={transitionBehavior}
        data-transition-group={transitionGroup}
        download={download}
        href={href}
        onFocus={handleFocus}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
        replace={replace}
        ref={ref}
        scroll={scroll}
        target={target}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

TransitionLink.displayName = "TransitionLink";
