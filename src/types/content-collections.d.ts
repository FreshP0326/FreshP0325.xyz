declare module "content-collections" {
  export interface TocItem {
    id: string;
    text: string;
    level: number;
  }

  export interface Post {
    title: string;
    summary: string;
    date: string;
    author: string;
    draft: boolean;
    categories: string[];
    tags: string[];
    content: string;
    slug: string;
    formattedDateShort: string;
    formattedDateLong: string;
    mdx: string;
    readingTime: string;
    wordCount: number;
    toc: TocItem[];
  }

  export interface BiographyEntry {
    title: string;
    locale?: string;
    content: string;
    mdx: string;
  }

  export interface DiscographyLink {
    label: string;
    url: string;
  }

  export interface DiscographyEntry {
    title: string;
    date: string;
    cover: string;
    summary?: string;
    links?: DiscographyLink[];
    tracks?: string[];
    credits?: string[];
    content: string;
    slug: string;
    formattedDateShort: string;
    formattedDateLong: string;
    mdx: string;
  }

  export const allPosts: Post[];
  export const allBiographies: BiographyEntry[];
  export const allDiscographies: DiscographyEntry[];
}
