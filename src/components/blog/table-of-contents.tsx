import { type TocItem } from "@/types";
import { cn } from "@/lib/utils";

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="sidebar-card sticky top-8 space-y-3 p-5">
      <h3 className="px-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">On This Page</h3>
      <nav className="space-y-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "block rounded-r-xl border-l-2 border-transparent py-1.5 pl-4 text-sm text-muted-foreground transition-colors hover:border-muted-foreground/40 hover:text-foreground",
              item.level === 3 && "ml-4",
            )}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
