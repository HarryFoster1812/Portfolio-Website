import { allPosts } from "@/generated/postsMeta"

export type BlogPostMeta = {
  filename: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  featured?: boolean;
  series?: {
    name: string;
    part: number;
    total?: number;
  };
  project?: {
    name: string;
    slug: string;
  };
};

export function getAllBlogPosts(): BlogPostMeta[] {
  return allPosts;
}
