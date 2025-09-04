import { getAllBlogPosts } from '@/lib/blog';
import { fetchGitHubRepos, type Repo } from "@/lib/repos";

export const dynamic = 'force-dynamic';

const BASE_URL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

// Simulate dynamic fetching
async function fetchProjects() {
    const repos = await fetchGitHubRepos();
    return repos.map((repo: Repo) => ({
        slug: repo.name.toLowerCase().replace(/\s+/g, '-'),
    }));
}

async function fetchBlogPosts() {
    const posts = getAllBlogPosts();
    return posts.map(post => ({ slug: post.filename }));
}

export async function GET() {
    const projects = await fetchProjects();
    const blogs = await fetchBlogPosts();

    const staticPaths = ['', '/projects', '/blog', '/Harry_Foster_CV.pdf'];

    const projectPaths = projects.map(p => `/projects/${p.slug}`);
    const blogPaths = blogs.map(b => `/blog/${b.slug}`);

    const allPaths = [...staticPaths, ...projectPaths, ...blogPaths];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths .map(path => 
` <url>
<loc>${BASE_URL}${path}</loc>
</url>`
).join('\n')}
</urlset>`;

    return new Response(sitemap.trim(), {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}

