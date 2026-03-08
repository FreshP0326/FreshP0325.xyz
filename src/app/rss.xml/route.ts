import RSS from "rss";
import { NextResponse } from "next/server";

import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { getAllPosts } from "@/lib/content";

export const dynamic = "force-static";

export async function GET() {
  try {
    const posts = getAllPosts();
    const siteUrl = siteConfig.url;

    const feed = new RSS({
      title: siteConfig.title,
      description: siteConfig.description,
      site_url: siteUrl,
      feed_url: `${siteUrl}/rss.xml`,
      copyright: `${new Date().getFullYear()} ${siteConfig.author.name}`,
      language: "zh-CN",
      pubDate: new Date(),
    });

    posts.forEach((post) => {
      feed.item({
        title: post.title,
        description: post.summary || "",
        url: `${siteUrl}/${routing.defaultLocale}/blog/${post.slug}`,
        date: post.date,
        author: post.author,
        categories: post.categories,
      });
    });

    return new NextResponse(feed.xml({ indent: true }), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Failed to generate RSS feed:", error);

    return NextResponse.json(
      { error: "Failed to generate RSS feed" },
      { status: 500 },
    );
  }
}
