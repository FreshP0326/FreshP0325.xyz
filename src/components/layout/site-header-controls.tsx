"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

import { HeaderPreferencesTrigger } from "@/components/layout/header-preferences-trigger";
import { MobileNav } from "@/components/layout/mobile-nav";
import { TransitionLink } from "@/components/transition/transition-link";
import { Button } from "@/components/ui/button";
import { type SearchPost } from "@/types";
import { cn } from "@/lib/utils";

const SearchDialog = dynamic(
  () => import("@/components/blog/search-dialog").then((mod) => mod.SearchDialog),
  {
    ssr: false,
  },
);

interface SiteHeaderControlsProps {
  currentLocale: string;
  languageLabel: string;
  localeLabels: {
    zh: string;
    en: string;
    ja: string;
  };
  navItems: Array<{
    label: string;
    href: string;
  }>;
  searchLabel: string;
  themeLabel: string;
  themeModeLabels: {
    light: string;
    dark: string;
    system: string;
  };
}

export function SiteHeaderControls({
  currentLocale,
  languageLabel,
  localeLabels,
  navItems,
  searchLabel,
  themeLabel,
  themeModeLabels,
}: SiteHeaderControlsProps) {
  const pathname = usePathname();
  const markerRef = React.useRef<HTMLDivElement | null>(null);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isSearchLoading, setIsSearchLoading] = React.useState(false);
  const [searchIndex, setSearchIndex] = React.useState<SearchPost[]>([]);
  const [shouldRenderSearch, setShouldRenderSearch] = React.useState(false);

  const getLocalizedHref = React.useCallback(
    (href: string) => `/${currentLocale}${href}`,
    [currentLocale],
  );

  React.useEffect(() => {
    const header = markerRef.current?.closest("[data-site-header]");

    if (!header) {
      return;
    }

    const handleScroll = () => {
      header.setAttribute("data-scrolled", window.scrollY > 24 ? "true" : "false");
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      header.setAttribute("data-scrolled", "false");
    };
  }, []);

  const loadSearchIndex = React.useCallback(async () => {
    if (searchIndex.length > 0 || isSearchLoading) {
      return;
    }

    setIsSearchLoading(true);

    try {
      const response = await fetch("/search-index.json", {
        method: "GET",
        cache: "force-cache",
      });

      if (!response.ok) {
        throw new Error(`Failed to load search index: ${response.status}`);
      }

      const data = (await response.json()) as SearchPost[];
      setSearchIndex(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearchLoading(false);
    }
  }, [isSearchLoading, searchIndex.length]);

  const openSearch = React.useCallback(() => {
    setShouldRenderSearch(true);
    setIsSearchOpen(true);
    void loadSearchIndex();
  }, [loadSearchIndex]);

  const closeSearch = React.useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        openSearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openSearch]);

  const isActive = React.useCallback(
    (href: string) => {
      const localizedHref = getLocalizedHref(href);
      return pathname === localizedHref || pathname.startsWith(`${localizedHref}/`);
    },
    [getLocalizedHref, pathname],
  );

  return (
    <>
      <div ref={markerRef} className="flex flex-1 items-center justify-end gap-4 md:gap-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={openSearch}
          className="h-8 w-8 rounded-full text-muted-foreground transition-all hover:bg-muted"
          title={`${searchLabel} (Ctrl/Cmd+K)`}
          aria-label={searchLabel}
        >
          <Search className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-1 text-sm font-medium text-muted-foreground md:flex">
            {navItems.map((item) => {
              const localizedHref = getLocalizedHref(item.href);

              return (
                <TransitionLink
                  key={item.href}
                  href={localizedHref}
                  className={cn(
                    "group relative rounded-full px-3 py-2 transition-colors duration-200 hover:text-foreground",
                    isActive(item.href) && "text-foreground",
                  )}
                >
                  <span>{item.label}</span>
                  <span
                    className={cn(
                      "absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100",
                      isActive(item.href) && "scale-x-100",
                    )}
                  />
                </TransitionLink>
              );
            })}
          </nav>

          <div className="hidden h-4 w-px bg-border/60 md:block" />
          <HeaderPreferencesTrigger
            currentLocale={currentLocale}
            languageLabel={languageLabel}
            localeLabels={localeLabels}
            themeLabel={themeLabel}
            themeModeLabels={themeModeLabels}
          />
          <MobileNav
            navItems={navItems}
            currentLocale={currentLocale}
            languageLabel={languageLabel}
            localeLabels={localeLabels}
            pathname={pathname}
            searchLabel={searchLabel}
            themeLabel={themeLabel}
            themeModeLabels={themeModeLabels}
            onSearchOpen={openSearch}
          />
        </div>
      </div>

      {shouldRenderSearch ? (
        <SearchDialog
          currentLocale={currentLocale}
          isOpen={isSearchOpen}
          isLoading={isSearchLoading}
          closeSearch={closeSearch}
          searchIndex={searchIndex}
        />
      ) : null}
    </>
  );
}
