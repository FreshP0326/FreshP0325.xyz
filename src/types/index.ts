import { type Post } from "content-collections";

export type { Post };

export interface SearchPost {
  slug: string;
  title: string;
  summary?: string;
  formattedDate: string;
  tags: string[];
  categories: string[];
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}
