"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSwitcherProps {
  currentLocale: string;
  languageLabel: string;
  localeLabels: {
    zh: string;
    en: string;
    ja: string;
  };
}

function replaceLocale(pathname: string, currentLocale: string, nextLocale: string) {
  const segments = pathname.split("/");

  if (segments[1] === currentLocale) {
    segments[1] = nextLocale;
    return segments.join("/") || `/${nextLocale}`;
  }

  return `/${nextLocale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function LanguageSwitcher({
  currentLocale,
  languageLabel,
  localeLabels,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    const nextPathname = replaceLocale(pathname || "/", currentLocale, newLocale);
    router.replace(nextPathname);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted"
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">{languageLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLocaleChange("zh")} disabled={currentLocale === "zh"}>
          {localeLabels.zh}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLocaleChange("en")} disabled={currentLocale === "en"}>
          {localeLabels.en}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLocaleChange("ja")} disabled={currentLocale === "ja"}>
          {localeLabels.ja}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
