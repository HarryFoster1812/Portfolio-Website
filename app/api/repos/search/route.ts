import { NextResponse } from "next/server";
import { fetchGitHubRepos, type Repo } from "@/lib/repos";

type RepoSearchResponse = {
  repos: Repo[];
  totalPages: number;
  currentPage: number;
  availableLanguages: string[];
  availableTopics: string[];
};

// --- Simple in-memory cache ---
const cachedRepos: { timestamp: number; data: Repo[] } = {
  timestamp: 0,
  data: [],
};

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const search = searchParams.get("search")?.toLowerCase() || null;
  const tag = searchParams.get("tag")?.toLowerCase() || null;
  const language = searchParams.get("language")?.toLowerCase() || null;
  const sortBy = (searchParams.get("sort") as keyof Repo) || "updatedAt";
  const order = (searchParams.get("order") || "desc") as "asc" | "desc";

  if (page < 1 || limit < 1) {
    return NextResponse.json(
      { error: "Invalid page or limit parameter" },
      { status: 400 }
    );
  }

  // --- Fetch repos with cache ---
  const now = Date.now();
  let repos: Repo[];
  if (!cachedRepos.data.length || now - cachedRepos.timestamp > CACHE_TTL) {
    repos = await fetchGitHubRepos(); // this already uses next revalidate
    cachedRepos.data = repos;
    cachedRepos.timestamp = now;
  } else {
    repos = cachedRepos.data;
  }

  // --- Filtering ---
  if (search) {
    repos = repos.filter(
      (r) =>
        r.name.toLowerCase().includes(search) ||
        (r.description?.toLowerCase().includes(search) ?? false)
    );
  }

  if (tag) {
    repos = repos.filter((r) => r.topics.some((t) => t.toLowerCase() === tag));
  }

  if (language) {
    repos = repos.filter(
      (r) => r.language?.toLowerCase() === language
    );
  }

  // --- Sorting ---
  repos.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (aVal instanceof Date && bVal instanceof Date) {
      return order === "asc"
        ? aVal.getTime() - bVal.getTime()
        : bVal.getTime() - aVal.getTime();
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return order === "asc" ? aVal - bVal : bVal - aVal;
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return order === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return 0;
  });

  // --- Pagination ---
  const totalCount = repos.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const reposForPage = repos.slice(startIndex, endIndex);

  // --- Contextual info ---
  const availableLanguages = Array.from(
    new Set(repos.map((r) => r.language).filter(Boolean))
  ).sort();

  const allTopics = repos.flatMap((r) => r.topics);
  const availableTopics = Array.from(new Set(allTopics)).sort();

  return NextResponse.json({
    repos: reposForPage,
    totalPages,
    currentPage: page,
    availableLanguages,
    availableTopics,
  } as RepoSearchResponse);
}
