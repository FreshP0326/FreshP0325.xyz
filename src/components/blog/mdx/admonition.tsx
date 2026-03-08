import React from "react";
import { cn } from "@/lib/utils";
import {
  Info,
  Lightbulb,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Flame,
  ChevronRight,
} from "lucide-react";

export const Admonition = ({
  type,
  title,
  collapse,
  children,
}: {
  type: string;
  title?: string;
  collapse?: "+" | "-";
  children: React.ReactNode;
}) => {
  const configs = {
    note: {
      icon: Info,
      title: "Note",
      accent: "var(--color-blue-500)",
      bg: "rgba(59, 130, 246, 0.1)",
    },
    info: {
      icon: Info,
      title: "Info",
      accent: "var(--color-cyan-500)",
      bg: "rgba(6, 182, 212, 0.1)",
    },
    tip: {
      icon: Lightbulb,
      title: "Tip",
      accent: "var(--color-emerald-500)",
      bg: "rgba(16, 185, 129, 0.1)",
    },
    important: {
      icon: AlertCircle,
      title: "Important",
      accent: "var(--color-violet-500)",
      bg: "rgba(139, 92, 246, 0.1)",
    },
    warning: {
      icon: AlertTriangle,
      title: "Warning",
      accent: "var(--color-amber-500)",
      bg: "rgba(245, 158, 11, 0.1)",
    },
    danger: {
      icon: Flame,
      title: "Danger",
      accent: "var(--color-red-600)",
      bg: "rgba(220, 38, 38, 0.1)",
    },
    caution: {
      icon: XCircle,
      title: "Caution",
      accent: "var(--color-red-500)",
      bg: "rgba(239, 68, 68, 0.1)",
    },
  };

  const config = configs[type as keyof typeof configs] || configs.note;
  const Icon = config.icon;
  const displayTitle = title === "" ? null : title || config.title;
  const boxStyle: React.CSSProperties = {
    borderLeftColor: config.accent,
    backgroundColor: config.bg,
  };

  const header = displayTitle && (
    <div
      className={cn(
        "flex items-center gap-2 font-bold tracking-tight py-2 px-4 border-b border-black/5 dark:border-white/5",
        collapse && "cursor-pointer select-none"
      )}
    >
      {collapse && (
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            collapse === "+" ? "rotate-90" : "group-open:rotate-90"
          )}
        />
      )}
      <Icon className="h-4 w-4" style={{ color: config.accent }} />
      <span className="text-sm" style={{ color: config.accent }}>{displayTitle}</span>
    </div>
  );

  const content = (
    <div className="p-4 text-sm leading-relaxed text-foreground/90 prose-sm dark:prose-invert max-w-none [&>p]:my-0 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      {children}
    </div>
  );

  if (collapse) {
    return (
      <details
        className={cn(
          "group my-6 flex flex-col border-l-4 shadow-sm rounded-r-lg overflow-hidden transition-all"
        )}
        style={boxStyle}
        open={collapse === "+"}
      >
        <summary className="list-none outline-none">{header}</summary>
        {content}
      </details>
    );
  }

  return (
    <div
      className={cn(
        "my-6 flex flex-col border-l-4 shadow-sm rounded-r-lg overflow-hidden"
      )}
      style={boxStyle}
    >
      {header}
      {content}
    </div>
  );
};
