import { getAllBlogPosts } from '@/lib/blog';

export async function GET() {
  const posts = getAllBlogPosts();

  return new Response(JSON.stringify(posts), {
    headers: { 'Content-Type': 'application/json' },
  });
}
