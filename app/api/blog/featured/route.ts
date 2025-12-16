import { getAllBlogPosts } from '@/lib/blog';


export async function GET() {
  const posts = await Promise.resolve(getAllBlogPosts());
    const featured_posts = posts.filter((post) => post.featured === true)
  return new Response(JSON.stringify(featured_posts), {
    headers: { "Content-Type": "application/json" },
  });
}
