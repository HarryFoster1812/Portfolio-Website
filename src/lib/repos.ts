export interface Repo {
  id: number;
  name: string;
  description: string | null;
  pushed_at: string;
  created_at: string;
  language: string;
}

/**
 * Fetch GitHub repos for the user "HarryFoster1812"
 */
export async function fetchGitHubRepos(): Promise<Repo[]> {
  const response = await fetch("https://api.github.com/users/HarryFoster1812/repos");
  if (!response.ok) {
    throw new Error(`GitHub API responded with ${response.status}`);
  }
  const data: Repo[] = await response.json();
  return data;
}
