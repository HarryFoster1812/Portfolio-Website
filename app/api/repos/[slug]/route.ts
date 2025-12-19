import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongoose";
import { fetchGitHubRepos, Repo} from "@/lib/repos";

const GITHUB_API = process.env.GITHUB_API;

const repoContentSchema = new mongoose.Schema({
  repoName: { type: String, required: true, unique: true },
  content: { type: String, required: true },
});

const RepoContent =
  mongoose.models.RepoContent || mongoose.model("RepoContent", repoContentSchema);

interface RepoContentDoc {
  repoName: string;
  content: string;
}

type RepoWithContent = Repo & { content?: string };

const memoryCache = new Map<string, {  data: RepoWithContent; expires: number }>();
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24h

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const slugLower = slug.toLowerCase();

  try {
    console.log(`[Repo API] Request received for slug: "${slug}"`);

    // Fetch repo metadata
    console.log(`[Repo API] Fetching GitHub repos for user...`);
    const repos = await fetchGitHubRepos();
    const repo = repos.find(r => r.name.toLowerCase() === slugLower);

    if (!repo) {
      console.warn(`[Repo API] GitHub repo not found: "${slug}"`);
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    console.log(`[Repo API] Found GitHub repo: "${repo.name}"`);

    // Check memory cache
    const cached = memoryCache.get(slugLower);
    if (cached && cached.expires > Date.now()) {
      console.log(`[Repo API] Returning from memory cache: "${slug}"`);
      return NextResponse.json(cached.data, { 
        status: 200, 
        headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=86400" }
      });
    }

    // Connect to MongoDB
    await connectDB();
    console.log("[Repo API] Connected to MongoDB");

    // Escape slug for regex
    const escapedSlug = slug.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    console.log(`[Repo API] Searching MongoDB with regex: /^${escapedSlug}$/i`);

    const dbEntry = await RepoContent.findOne({
      repoName: { $regex: new RegExp(`^${escapedSlug}$`, "i") }
    }).lean<RepoContentDoc>();

    if (dbEntry) {
      console.log(`[Repo API] Found entry in MongoDB for "${slug}"`);
      const content = dbEntry.content;
      memoryCache.set(slugLower, {data: {...repo, content}, expires: Date.now() + CACHE_DURATION_MS });
      return NextResponse.json({...repo,content}, { 
        status: 200, 
        headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=86400" }
      });
    } else {
      console.log(`[Repo API] No entry found in MongoDB for "${slug}"`);
    }


    // Fetch content from GitHub
    let content: string | undefined;
    console.log(`[Repo API] Fetching PORTFOLIO_README.md for "${slug}"`);
    const portfolioReadmeRes = await fetch(
      `https://api.github.com/repos/HarryFoster1812/${slug}/contents/PORTFOLIO_README.md`,
      { headers: { Authorization: `token ${GITHUB_API}`, Accept: "application/vnd.github.v3.raw" } }
    );

    if (portfolioReadmeRes.ok) {
      content = await portfolioReadmeRes.text();
      console.log(`[Repo API] Found PORTFOLIO_README.md for "${slug}"`);
    } else {
      console.log(`[Repo API] PORTFOLIO_README.md not found, trying README.md`);
      const readmeRes = await fetch(
        `https://api.github.com/repos/HarryFoster1812/${slug}/readme`,
        { headers: { Authorization: `token ${GITHUB_API}`, Accept: "application/vnd.github.v3.raw" } }
      );
      if (readmeRes.ok) {
        content = await readmeRes.text();
        console.log(`[Repo API] Found README.md for "${slug}"`);
      } else {
        console.warn(`[Repo API] No README content found for "${slug}"`);
      }
    }

    const result = { ...repo, content };
    memoryCache.set(slugLower, { data: result, expires: Date.now() + CACHE_DURATION_MS });
    console.log(`[Repo API] Returning GitHub data for "${slug}"`);

    return NextResponse.json(result, { 
      status: 200, 
      headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=86400" }
    });

  } catch (err) {
    console.error(`[Repo API] Unexpected error for "${slug}":`, err);
    return NextResponse.json({ message: "Error fetching repository content" }, { status: 500 });
  }
}
