"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Menu, Search, X } from "lucide-react";

import { TransitionLink } from "@/components/transition/transition-link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HeaderPreferencesPanel = dynamic(
  () =>
    import("@/components/layout/header-preferences-panel").then(
      (mod) => mod.HeaderPreferencesPanel,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="mt-3 h-8 w-full rounded-xl bg-muted" />
    ),
  },
);

interface MobileNavProps {
  navItems: Array<{
    label: string;
    href: string;
  }>;
  currentLocale: string;
  languageLabel: string;
  localeLabels: {
    zh: string;
    en: string;
    ja: string;
  };
  pathname: string;
  searchLabel: string;
  themeLabel: string;
  themeModeLabels: {
    light: string;
    dark: string;
    system: string;
  };
  onSearchOpen: () => void;
}

export function MobileNav({
  navItems,
  currentLocale,
  languageLabel,
  localeLabels,
  pathname,
  searchLabel,
  themeLabel,
  themeModeLabels,
  onSearchOpen,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const { body, documentElement } = document;
    const scrollY = window.scrollY;
    const previousBodyStyle = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    const previousHtmlStyle = {
      overflow: documentElement.style.overflow,
      overscrollBehavior: documentElement.style.overscrollBehavior,
    };

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    documentElement.style.overflow = "hidden";
    documentElement.style.overscrollBehavior = "none";

    return () => {
      body.style.overflow = previousBodyStyle.overflow;
      body.style.position = previousBodyStyle.position;
      body.style.top = previousBodyStyle.top;
      body.style.left = previousBodyStyle.left;
      body.style.right = previousBodyStyle.right;
      body.style.width = previousBodyStyle.width;
      documentElement.style.overflow = previousHtmlStyle.overflow;
      documentElement.style.overscrollBehavior = previousHtmlStyle.overscrollBehavior;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const handleOpenSearch = () => {
    onSearchOpen();
    setIsOpen(false);
  };

  const getLocalizedHref = (href: string) => `/${currentLocale}${href}`;

  const isActive = (href: string) => {
    const localizedHref = getLocalizedHref(href);
    return pathname === localizedHref || pathname.startsWith(`${localizedHref}/`);
  };

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="rounded-full"
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      <nav
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-dvh w-3/4 max-w-sm flex-col overflow-y-auto overscroll-contain border-l border-border/40 bg-card p-6 shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!isOpen}
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="text-lg font-bold">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="rounded-full"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <TransitionLink
              key={item.label}
              href={getLocalizedHref(item.href)}
              onClick={() => setIsOpen(false)}
              className={cn(
                "rounded-xl px-4 py-3 text-lg font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                isActive(item.href) && "bg-muted text-foreground",
              )}
            >
              {item.label}
            </TransitionLink>
          ))}
        </div>

        <div className="mt-auto border-t border-border/40 pt-8">
          <p className="mb-3 px-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {searchLabel}
          </p>
          <Button
            variant="ghost"
            className="mb-6 w-full justify-start gap-3 rounded-xl"
            onClick={handleOpenSearch}
          >
            <Search className="h-4 w-4" />
            {searchLabel}
          </Button>

          <div className="rounded-2xl border border-border/40 bg-muted/30 p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {themeLabel}
            </p>
            {isOpen ? (
              <HeaderPreferencesPanel
                currentLocale={currentLocale}
                languageLabel={languageLabel}
                localeLabels={localeLabels}
                themeLabel={themeLabel}
                themeModeLabels={themeModeLabels}
                className="mt-3"
                showLabel={false}
                unstyled
              />
            ) : null}
          </div>
        </div>
      </nav>
    </div>
  );
}
