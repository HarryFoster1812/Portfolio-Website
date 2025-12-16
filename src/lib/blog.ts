import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

let cachedPosts: BlogPostMeta[] | null = null;

export function getAllBlogPosts(): BlogPostMeta[] {
  if (cachedPosts) {
    return cachedPosts;
  }

  const files = fs.readdirSync(BLOG_DIR);

  cachedPosts = files
    .filter(f => f.endsWith(".md"))
    .map(file => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data } = matter(raw);

      return {
        filename: file.replace(/\.md$/, ""),
        title: String(data.title ?? "Untitled"),
        description: String(data.description ?? ""),
        date: String(data.date ?? ""),
        tags: data.tags ?? [],
        featured: Boolean(data.featured),
        series: data.series,
        project: data.project,
      };
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return cachedPosts;
}
