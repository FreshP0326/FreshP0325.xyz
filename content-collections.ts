import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";
import readingTime from "reading-time";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import rehypeRaw from "rehype-raw";
import { remarkAdmonitions } from "./src/lib/remark-admonitions";
import rehypePrettyCode from "rehype-pretty-code";
import { rehypeImageMetadata } from "./src/lib/rehype-image-metadata";
import { extractTocItems } from "./src/lib/extract-toc-items";

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const formatDate = (value: string, variant: "short" | "long" = "short") => {
  const date = new Date(value);
  return (variant === "long" ? longDateFormatter : shortDateFormatter).format(date);
};

const biography = defineCollection({
  name: "biography",
  directory: "content",
  include: "biography*.mdx",
  schema: z.object({
    title: z.string(),
    locale: z.string().optional(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm, remarkDirective, remarkAdmonitions],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: {
              dark: "tokyo-night",
              light: "github-light",
            },
            keepBackground: false,
          },
        ],
        [
          rehypeRaw,
          {
            passThrough: [
              "mdxjsEsm",
              "mdxJsxFlowElement",
              "mdxJsxTextElement",
              "mdxFlowExpression",
              "mdxTextExpression",
            ],
          },
        ],
        rehypeImageMetadata,
      ],
    });
    return {
      ...document,
      mdx,
    };
  },
});

const discography = defineCollection({
  name: "discography",
  directory: "content/discography",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    date: z.string(),
    cover: z.string(),
    summary: z.string().optional(),
    links: z.array(
      z.object({
        label: z.string(),
        url: z.string().url(),
      })
    ).optional(),
    tracks: z.array(z.string()).optional(),
    credits: z.array(z.string()).optional(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm, remarkDirective, remarkAdmonitions],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: {
              dark: "tokyo-night",
              light: "github-light",
            },
            keepBackground: false,
          },
        ],
        [
          rehypeRaw,
          {
            passThrough: [
              "mdxjsEsm",
              "mdxJsxFlowElement",
              "mdxJsxTextElement",
              "mdxFlowExpression",
              "mdxTextExpression",
            ],
          },
        ],
        rehypeImageMetadata,
      ],
    });
    const slug = document._meta.path.replace(/\.mdx$/, "");
    return {
      ...document,
      slug,
      formattedDateShort: formatDate(document.date),
      formattedDateLong: formatDate(document.date, "long"),
      mdx,
    };
  },
});

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.string(),
    author: z.string().default("Black201"),
    draft: z.boolean().default(false),
    categories: z.array(z.string()).default(["Uncategorized"]),
    tags: z.array(z.string()).default([]),
    content: z.string(),
  }),
  transform: async (document, context) => {
    // 1. 双向链接解析: [[slug]] -> [slug](/blog/slug)
    // 使用更严格的正则匹配，只允许字母、数字、连字符和下划线
    const contentWithLinks = (document.content || "").replace(
      /\[\[([a-zA-Z0-9_-]+)\]\]/g,
      (_, slug) => `[${slug}](./${slug})`
    );

    const mdx = await compileMDX(
      context,
      {
        ...document,
        content: contentWithLinks,
      },
      {
        remarkPlugins: [remarkGfm, remarkDirective, remarkAdmonitions],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
            {
              theme: {
                dark: "tokyo-night",
                light: "github-light",
              },
              keepBackground: false,
            },
          ],
          [
            rehypeRaw,
            {
              passThrough: [
                "mdxjsEsm",
                "mdxJsxFlowElement",
                "mdxJsxTextElement",
                "mdxFlowExpression",
                "mdxTextExpression",
              ],
            },
          ],
          rehypeImageMetadata,
        ],
      }
    );

    // 2. 阅读时间与字数统计
    const stats = readingTime(document.content || "");
    const slug = document._meta.path.replace(/\.mdx$/, "");

    return {
      ...document,
      slug,
      formattedDateShort: formatDate(document.date),
      formattedDateLong: formatDate(document.date, "long"),
      mdx,
      readingTime: stats.text,
      wordCount: stats.words,
      toc: extractTocItems(contentWithLinks),
    };
  },
});

export default defineConfig({
  content: [biography, discography, posts],
});
