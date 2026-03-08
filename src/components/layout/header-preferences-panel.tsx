"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSettings } from "@/components/theme-settings";
import { ThemeModeSwitcher } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

interface HeaderPreferencesPanelProps {
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
  className?: string;
  showLabel?: boolean;
  unstyled?: boolean;
}

export function HeaderPreferencesPanel({
  currentLocale,
  languageLabel,
  localeLabels,
  themeLabel,
  themeModeLabels,
  className,
  showLabel = true,
  unstyled = false,
}: HeaderPreferencesPanelProps) {
  return (
    <div
      className={cn(
        !unstyled &&
          "rounded-2xl border border-border/50 bg-card/95 p-3 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-md",
        className,
      )}
    >
      {showLabel ? (
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {themeLabel}
        </p>
      ) : null}
      <div className="flex items-center gap-2">
        <ThemeModeSwitcher themeLabel={themeLabel} labels={themeModeLabels} />
        <ThemeSettings />
        <div className="ml-auto">
          <LanguageSwitcher
            currentLocale={currentLocale}
            languageLabel={languageLabel}
            localeLabels={localeLabels}
          />
        </div>
      </div>
    </div>
  );
}
