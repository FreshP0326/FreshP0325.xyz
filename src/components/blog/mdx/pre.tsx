import React from "react";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

export const Pre = (props: React.HTMLAttributes<HTMLPreElement>) => {
  const { children, className, ...rest } = props;
  const language = (props as any)["data-language"];
  const theme = (props as any)["data-theme"];

  // Extract raw text from children for copying
  const getRawText = (node: any): string => {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(getRawText).join("");
    if (node?.props?.children) return getRawText(node.props.children);
    return "";
  };

  const rawText = getRawText(children);

  return (
    <div className="relative group my-6 overflow-hidden rounded-xl border border-border/40 shadow-xl">
      <div className="absolute right-3 top-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        {language && (
          <span className="text-[10px] font-mono text-muted-foreground/70 select-none uppercase tracking-wider bg-muted/50 px-2 py-0.5 rounded">
            {language}
          </span>
        )}
        <CopyButton text={rawText} />
      </div>
      <pre
        className={cn(
          "overflow-x-auto p-4 font-mono text-sm leading-relaxed",
          theme === "light" && "bg-white dark:hidden",
          theme === "dark" && "bg-[#0d0d0d] hidden dark:block",
          theme !== "light" && theme !== "dark" && "bg-[#f8fafc] dark:bg-[#0d0d0d]",
          className
        )}
        {...rest}
      >
        {children}
      </pre>
    </div>
  );
};
