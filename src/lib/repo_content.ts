import { fetchGitHubRepos, Repo } from "./repos";
import { connectDB } from "./mongoose";
import mongoose from "mongoose";

const repoContentSchema = new mongoose.Schema({
  repoName: { type: String, required: true, unique: true },
  content: { type: String, required: true },
});
const RepoContent =
  mongoose.models.RepoContent || mongoose.model("RepoContent", repoContentSchema);

interface repoContentDoc {
    repoName: string,
    content: string
}

export type RepoWithContent = Repo & { content?: string };

const memoryCache = new Map<string, { data: RepoWithContent; expires: number }>();
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

export async function getRepoWithContent(slug: string): Promise<RepoWithContent | null> {
  const slugLower = slug.toLowerCase();

  // Check memory cache first
  const cached = memoryCache.get(slugLower);
  if (cached && cached.expires > Date.now()) return cached.data;

  // Fetch GitHub repos
  const repos = await fetchGitHubRepos();
  const repo = repos.find(r => r.name.toLowerCase() === slugLower);
  if (!repo) return null;

  // Connect to MongoDB
  await connectDB();

  const dbEntry = await RepoContent.findOne({ repoName: new RegExp(`^${slug}$`, "i") }).lean<repoContentDoc>();
  let content = dbEntry?.content;

  // fetch from GitHub if no MongoDB content
  if (!content) {
    const GITHUB_API = process.env.GITHUB_API;
    const portfolioReadme = await fetch(
      `https://api.github.com/repos/HarryFoster1812/${slug}/contents/PORTFOLIO_README.md`,
      { headers: { Authorization: `token ${GITHUB_API}`, Accept: "application/vnd.github.v3.raw" } }
    );
    if (portfolioReadme.ok) content = await portfolioReadme.text();
    else {
      const readmeRes = await fetch(
        `https://api.github.com/repos/HarryFoster1812/${slug}/readme`,
        { headers: { Authorization: `token ${GITHUB_API}`, Accept: "application/vnd.github.v3.raw" } }
      );
      if (readmeRes.ok) content = await readmeRes.text();
    }
  }

  const result: RepoWithContent = { ...repo, content };
  memoryCache.set(slugLower, { data: result, expires: Date.now() + CACHE_DURATION_MS });
  return result;
}
