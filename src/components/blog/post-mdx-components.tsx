import * as React from "react";
import { MDXContent } from "@content-collections/mdx/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  CheckSquare,
  Square,
} from "lucide-react";

// Import refactored components
import { Admonition } from "./mdx/admonition";
import { Pre } from "./mdx/pre";

const components = {
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt, width, height, priority, ...rest } = props as any;
    const resolvedSrc = src as string;
    const resolvedWidth = typeof width === "number" ? width : Number(width) || 1200;
    const resolvedHeight = typeof height === "number" ? height : Number(height) || 630;
    const isPriority = Boolean(priority);
    const isUnoptimized = /\.svg(?:\?|$)|\.gif(?:\?|$)/i.test(resolvedSrc);

    return (
      <Image
        src={resolvedSrc}
        alt={alt ?? ""}
        width={resolvedWidth}
        height={resolvedHeight}
        sizes="(min-width: 1536px) 896px, (min-width: 1280px) 896px, (min-width: 768px) calc(100vw - 12rem), 100vw"
        loading={isPriority ? undefined : "lazy"}
        decoding="async"
        priority={isPriority}
        unoptimized={isUnoptimized}
        className="my-8 h-auto w-full rounded-2xl border border-border/40 shadow-sm"
        {...(rest as any)}
      />
    );
  },
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="mb-4 mt-8 text-3xl font-bold tracking-tight text-foreground font-display uppercase"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mb-4 mt-8 border-b border-border/40 pb-2 text-2xl font-bold tracking-tight text-foreground font-display uppercase flex items-center gap-3">
      <span className="text-primary/40 font-mono text-sm">//</span>
      {props.children}
    </h2>
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="mb-4 mt-6 text-xl font-semibold tracking-tight text-foreground"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="leading-7 text-muted-foreground [&:not(:first-child)]:mt-6"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="my-6 ml-6 list-disc text-muted-foreground [&>li]:mt-2"
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="my-6 ml-6 list-decimal text-muted-foreground [&>li]:mt-2"
      {...props}
    />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => {
    const children = React.Children.toArray(props.children);
    const firstChild = children[0];

    if (typeof firstChild === "string") {
      if (firstChild.startsWith("[x] ")) {
        return (
          <li className="flex items-start gap-2 my-2 list-none ml-[-1.5rem]">
            <CheckSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <span className="leading-7">
              {firstChild.replace("[x] ", "")}
              {children.slice(1)}
            </span>
          </li>
        );
      }
      if (firstChild.startsWith("[ ] ")) {
        return (
          <li className="flex items-start gap-2 my-2 list-none ml-[-1.5rem]">
            <Square className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <span className="leading-7 text-muted-foreground">
              {firstChild.replace("[ ] ", "")}
              {children.slice(1)}
            </span>
          </li>
        );
      }
    }

    return <li className="leading-7" {...props} />;
  },
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-12 border-border/20" {...props} />
  ),
  pre: Pre,
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    // 如果 code 标签在 pre 标签内（由 rehype-pretty-code 处理），它会有 data-language 属性
    const isCodeBlock = (props as any)["data-language"] !== undefined || (props as any)["data-theme"] !== undefined;
    
    if (isCodeBlock) {
      return <code className="relative font-mono text-sm" {...props} />;
    }
    
    // 行内代码
    return (
      <code
        className="relative rounded bg-muted/50 px-[0.3rem] py-[0.2rem] font-mono text-sm text-primary"
        {...props}
      />
    );
  },

  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => {
    const content = React.Children.toArray(props.children);
    const firstChild = content[0] as React.ReactElement;

    if (
      firstChild &&
      React.isValidElement(firstChild) &&
      firstChild.props &&
      typeof (firstChild.props as any).children === "string"
    ) {
      const text = (firstChild.props as any).children as string;
      // 匹配语法: [!type][+-] "title"
      const match = text.match(/^\[!([a-zA-Z]+)\]([\+\-])?(?:\s+"([^"]*)")?/i);

      if (match) {
        const type = match[1]!.toLowerCase();
        const collapse = match[2] as "+" | "-" | undefined;
        const title = match[3];

        const newChildren = [
          React.cloneElement(firstChild, {
            children: text
              .replace(/^\[![a-zA-Z]+\][\+\-]?\s*(?:"[^"]*")?\s*/i, "")
              .trim(),
          } as any),
          ...content.slice(1),
        ];

        // 如果第一行被清空了，移除它
        const firstNewChild = newChildren[0] as React.ReactElement;
        if (
          firstNewChild &&
          React.isValidElement(firstNewChild) &&
          (firstNewChild.props as any).children === "" &&
          newChildren.length > 1
        ) {
          newChildren.shift();
        }

        return (
          <Admonition type={type} title={title} collapse={collapse}>
            {newChildren}
          </Admonition>
        );
      }
    }

    return (
      <blockquote
        className="mt-8 border-l-2 border-primary/30 pl-8 italic text-muted-foreground leading-relaxed bg-muted/10 py-4 pr-4 rounded-r-xl"
        {...props}
      />
    );
  },
  iframe: (props: React.IframeHTMLAttributes<HTMLIFrameElement>) => {
    const { frameBorder, allowFullScreen, loading, ...rest } = props as any;
    return (
      <div className="my-8 aspect-video w-full overflow-hidden rounded-xl border border-border/40 shadow-sm">
        <iframe
          className="h-full w-full"
          frameBorder={frameBorder}
          allowFullScreen={allowFullScreen}
          loading={loading ?? "lazy"}
          {...rest}
          title={props.title ?? "Iframe content"}
        />
      </div>
    );
  },
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-10 w-full overflow-y-auto rounded-lg border border-border/20 bg-card/50 shadow-sm">
      <table className="w-full text-sm border-collapse font-mono" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead
      className="bg-muted/50 text-muted-foreground uppercase tracking-widest text-[10px] font-bold"
      {...props}
    />
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-6 py-4 text-left border-b border-border/40" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="px-6 py-4 border-b border-border/5 group-last:border-none"
      {...props}
    />
  ),
  // Footnotes styling
  section: (props: React.HTMLAttributes<HTMLElement>) => {
    if ((props as any)["data-footnotes"]) {
      return (
        <section
          className="mt-12 pt-8 border-t border-border/20 text-sm text-muted-foreground"
          {...props}
        />
      );
    }
    return <section {...props} />;
  },
  sup: (props: React.HTMLAttributes<HTMLElement>) => (
    <sup className="ml-0.5 text-primary hover:text-primary/80" {...props} />
  ),
  div: (props: React.HTMLAttributes<HTMLDivElement>) => {
    if ((props as any)["data-admonition"]) {
      const type = (props as any)["data-admonition"];
      return (
        <Admonition type={type}>
          {props.children}
        </Admonition>
      );
    }
    return <div {...props} />;
  },
};

export function ContentMdx({ code }: { code: string }) {
  return <MDXContent code={code} components={components as any} />;
}
