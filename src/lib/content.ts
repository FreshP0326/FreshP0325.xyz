// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - `.content-collections/generated` 会在首次 dev/build 时生成
import { allPosts } from "content-collections";
import { type Post, type SearchPost } from "@/types";
import { cache } from "react";

export const getAllPosts = cache(() => {
  // 只返回非 draft 的文章
  return allPosts
    .filter((p: Post) => !p.draft)
    .sort((a: Post, b: Post) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
});

export const getPostBySlug = cache((slug: string): Post | undefined => {
  return getAllPosts().find((p: Post) => p.slug === slug);
});

export const getSearchIndex = cache((): SearchPost[] => {
  return getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    formattedDate: post.formattedDateShort,
    tags: post.tags,
    categories: post.categories,
  }));
});

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) => post.categories.includes(category));
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function getAllCategories(): string[] {
  const categories = getAllPosts().flatMap((post) => post.categories);
  return Array.from(new Set(categories));
}

export function getAllTags(): string[] {
  const tags = getAllPosts().flatMap((post) => post.tags);
  return Array.from(new Set(tags));
}

export function getAllTagsWithCount(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagCount: Record<string, number> = {};
  
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getAdjacentPosts(currentSlug: string): { prevPost: Post | undefined; nextPost: Post | undefined } {
  const posts = getAllPosts();
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug);
  
  return {
    prevPost: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : undefined,
    nextPost: currentIndex > 0 ? posts[currentIndex - 1] : undefined,
  };
}

export type { Post };
