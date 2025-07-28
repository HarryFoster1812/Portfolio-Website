import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type BlogPostMeta = {
  filename: string;
  title: string;
  description: string;
  date: Date;
};

let cachedPosts: BlogPostMeta[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 20 * 60 * 1000; // 20 mins

export function getAllBlogPosts(): BlogPostMeta[] {
  const now = Date.now();

  if (cachedPosts && now - lastCacheTime < CACHE_DURATION) {
    return cachedPosts;
  }

  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  const files = fs.readdirSync(blogDir);

  const posts = files.map((filename) => {
  const filePath = path.join(blogDir, filename);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);


  const title = data.title || content.match(/^#\s+(.*)/m)?.[1] || 'No title';
  const description = data.description || 'No description';
  const date = data.date || '';

    return {
      filename: filename.replace(/\.md$/, ''),
      title,
      description,
      date,
    };
  });

  cachedPosts = posts;
  lastCacheTime = now;
  return posts;
}
