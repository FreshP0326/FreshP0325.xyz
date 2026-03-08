"use client";

import * as React from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ThemeMode = "light" | "dark" | "system";

const themeOptions: Array<{
  value: ThemeMode;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Laptop },
];

interface ThemeModeSwitcherProps {
  themeLabel: string;
  labels: Record<ThemeMode, string>;
}

export function ThemeModeSwitcher({ themeLabel, labels }: ThemeModeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = ((mounted ? theme : "system") ?? "system") as ThemeMode;
  const activeTheme =
    themeOptions.find((option) => option.value === currentTheme) ??
    ({ value: "system", icon: Laptop } as const);
  const ActiveIcon = activeTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={themeLabel}
        >
          <ActiveIcon className="h-4 w-4" />
          <span className="sr-only">{themeLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 rounded-2xl border-border/60 bg-card/95 p-2 shadow-lg backdrop-blur-md"
      >
        <DropdownMenuLabel className="px-2 pb-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {themeLabel}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={currentTheme} onValueChange={(value) => setTheme(value)}>
          {themeOptions.map((option) => {
            const Icon = option.icon;

            return (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                className="rounded-xl py-2 pl-8 pr-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{labels[option.value]}</span>
                </div>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const ThemeToggle = ThemeModeSwitcher;
