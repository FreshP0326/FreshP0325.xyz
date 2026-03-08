"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const HeaderPreferencesPanel = dynamic(
  () =>
    import("@/components/layout/header-preferences-panel").then(
      (mod) => mod.HeaderPreferencesPanel,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="absolute right-0 top-full z-50 mt-3 h-20 w-[220px] rounded-2xl border border-border/50 bg-card/95 p-3 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-md" />
    ),
  },
);

interface HeaderPreferencesTriggerProps {
  currentLocale: string;
  languageLabel: string;
  localeLabels: {
    zh: string;
    en: string;
    ja: string;
  };
  themeLabel: string;
  themeModeLabels: {
    light: string;
    dark: string;
    system: string;
  };
}

export function HeaderPreferencesTrigger({
  currentLocale,
  languageLabel,
  localeLabels,
  themeLabel,
  themeModeLabels,
}: HeaderPreferencesTriggerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [shouldLoad, setShouldLoad] = React.useState(false);

  const warmUp = React.useCallback(() => {
    setShouldLoad(true);
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative hidden md:block">
      <Button
        variant="ghost"
        size="icon"
        onPointerEnter={warmUp}
        onFocus={warmUp}
        onClick={() => {
          warmUp();
          setIsOpen((prev) => !prev);
        }}
        className="h-8 w-8 rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={themeLabel}
        aria-expanded={isOpen}
      >
        <Settings2 className="h-4 w-4" />
        <span className="sr-only">{themeLabel}</span>
      </Button>

      {isOpen && shouldLoad ? (
        <HeaderPreferencesPanel
          currentLocale={currentLocale}
          languageLabel={languageLabel}
          localeLabels={localeLabels}
          themeLabel={themeLabel}
          themeModeLabels={themeModeLabels}
          className="absolute right-0 top-full z-50 mt-3 w-[220px]"
        />
      ) : null}
    </div>
  );
}
