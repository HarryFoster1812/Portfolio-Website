import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

let cachedPosts: { filename: string; title: string }[] | null = null;
let lastCacheTime = 0; // timestamp in ms
const CACHE_DURATION = 20 * 60 * 1000; // 20 minutes in milliseconds

export async function GET() {
  const now = Date.now();

  if (cachedPosts && now - lastCacheTime < CACHE_DURATION) {
    // Return cached data if cache is still valid
    return new Response(JSON.stringify(cachedPosts), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Cache is missing or expired, re-generate data
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  const files = fs.readdirSync(blogDir);

  const posts = files.map((filename) => {
    const filePath = path.join(blogDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    const title = data.title || content.match(/^#\s+(.*)/m)?.[1] || 'No title';

    return {
      filename: filename.replace(/\.md$/, ''),
      title,
    };
  });

  cachedPosts = posts;
  lastCacheTime = now; // update cache timestamp

  return new Response(JSON.stringify(posts), {
    headers: { 'Content-Type': 'application/json' },
  });
}
