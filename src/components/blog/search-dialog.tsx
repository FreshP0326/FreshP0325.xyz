"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import Fuse from "fuse.js";
import { FileText, Search } from "lucide-react";

import { startRouteTransition } from "@/components/transition/start-route-transition";
import { highlightMatch } from "@/lib/highlight-match";
import { type SearchPost } from "@/types";

interface SearchDialogProps {
  currentLocale: string;
  isOpen: boolean;
  isLoading: boolean;
  closeSearch: () => void;
  searchIndex: SearchPost[];
}

export function SearchDialog({ currentLocale, isOpen, isLoading, closeSearch, searchIndex }: SearchDialogProps) {
  const [search, setSearch] = React.useState("");
  const router = useRouter();

  const fuse = React.useMemo(() => {
    return new Fuse(searchIndex, {
      keys: ["title", "summary", "tags", "categories"],
      threshold: 0.3,
    });
  }, [searchIndex]);

  const [results, setResults] = React.useState<SearchPost[]>(searchIndex.slice(0, 5));

  React.useEffect(() => {
    setResults(searchIndex.slice(0, 5));
  }, [searchIndex]);

  React.useEffect(() => {
    if (!search) {
      setResults(searchIndex.slice(0, 5));
      return;
    }

    const timer = window.setTimeout(() => {
      setResults(fuse.search(search).map((result) => result.item));
    }, 150);

    return () => window.clearTimeout(timer);
  }, [search, fuse, searchIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 pt-[20vh] backdrop-blur-sm animate-in fade-in duration-200">
      <div className="mx-4 w-full max-w-2xl">
        <Command
          className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-2xl animate-in zoom-in-95 duration-200"
          onKeyDown={(event) => {
            if (event.key === "Escape") closeSearch();
          }}
        >
          <div className="flex items-center border-b border-border/40 px-4">
            <Search className="mr-3 h-5 w-5 text-muted-foreground" />
            <Command.Input
              autoFocus
              placeholder="Search posts, tags, categories..."
              className="h-14 flex-1 bg-transparent text-base outline-none"
              value={search}
              onValueChange={setSearch}
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground opacity-100">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[350px] overflow-y-auto p-2">
            {isLoading && <div className="py-12 text-center text-sm text-muted-foreground">Loading search index...</div>}
            <Command.Empty className="py-12 text-center text-sm text-muted-foreground">No results found.</Command.Empty>

            {results.map((post) => (
              <Command.Item
                key={post.slug}
                onSelect={() => {
                  closeSearch();
                  startRouteTransition(() => {
                    router.push(`/${currentLocale}/blog/${post.slug}`);
                  });
                }}
                className="group flex cursor-pointer items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-muted aria-selected:bg-muted"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="truncate text-sm font-medium">{highlightMatch(post.title, search)}</h4>
                    <span className="whitespace-nowrap text-[10px] tabular-nums text-muted-foreground">{post.formattedDate}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{highlightMatch(post.summary || "", search)}</p>
                </div>
              </Command.Item>
            ))}
          </Command.List>

          <div className="flex items-center justify-between border-t border-border/40 bg-muted/20 px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <div className="flex gap-6">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded-md border border-border/60 bg-background px-1.5 py-0.5 text-[9px] shadow-sm">??</kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded-md border border-border/60 bg-background px-1.5 py-0.5 text-[9px] shadow-sm">ENTER</kbd>
                <span>Select</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded-md border border-border/60 bg-background px-1.5 py-0.5 text-[9px] shadow-sm">ESC</kbd>
                <span>Close</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 opacity-60">
              <kbd className="rounded-md border border-border/60 bg-background px-1.5 py-0.5 text-[9px]">? K</kbd>
              <span>Search</span>
            </div>
          </div>
        </Command>
        <div className="fixed inset-0 -z-10" onClick={closeSearch} />
      </div>
    </div>
  );
}
