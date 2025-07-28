import { getAllBlogPosts } from '@/lib/blog';

export async function GET() {
  const posts = getAllBlogPosts();

  posts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // Sort by date descending
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;

    // If dates are equal, sort by title ascending
    return a.title.localeCompare(b.title);
  });

  return new Response(JSON.stringify(posts), {
    headers: { "Content-Type": "application/json" },
  });
}
