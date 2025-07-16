import { fetchGitHubRepos, type Repo } from "@/lib/repos";

export async function GET() {
  try {
   const repos: Repo[] = await fetchGitHubRepos();
    return new Response(JSON.stringify(repos), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch repos" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
