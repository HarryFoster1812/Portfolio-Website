export interface GitHubRepoApi {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  created_at: string;
  pushed_at: string;
  clone_url: string;
  private: boolean;
  visibility: string;
  fork: boolean;
  size: number;
  archived: boolean;
  disabled: boolean;
}

export interface Repo {
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  watchers: number;
  forks: number;
  createdAt: Date;
  updatedAt: Date;
  cloneUrl: string;
  private: boolean;
  visibility: string;
  fork: boolean;
  size: number;
  archived: boolean;
  disabled: boolean;
}

export function repoFromApi(data: GitHubRepoApi): Repo {
  return {
    name: data.name,
    fullName: data.full_name,
    htmlUrl: data.html_url,
    description: data.description,
    language: data.language,
    topics: data.topics ?? [],
    stars: data.stargazers_count,
    watchers: data.watchers_count,
    forks: data.forks_count,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.pushed_at),
    cloneUrl: data.clone_url,
    private: data.private,
    visibility: data.visibility,
    fork: data.fork,
    size: data.size,
    archived: data.archived,
    disabled: data.disabled,
  };
}

// Filter helper
export function isPublicNonFork(repo: Repo): boolean {
  return !repo.private && !repo.fork && repo.visibility === "public";
}

// Optional: process a full API response array
export function fromApiResponse(dataArray: GitHubRepoApi[], blacklist: string[] = []): Repo[] {
  return dataArray
    .map(repoFromApi)
    .filter(isPublicNonFork)
    .filter(repo => !blacklist.includes(repo.name));
}



const USERNAME = "HarryFoster1812"
const blacklist_array: string[] = ["HarryFoster1812", "IR-Receiver", "New-tab-Inspiration"]

/**
 * Fetch GitHub repos for the user "HarryFoster1812" using personal API token
 */
export async function fetchGitHubRepos(): Promise<Repo[]> {
  const response = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100`,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_API}`,
        Accept: 'application/vnd.github.v3+json',
      },
      next: { revalidate: 24 * 60 * 60 }, // refresh project list daily
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API responded with ${response.status}`);
  }

  const data: GitHubRepoApi[] = await response.json();
  const repos: Repo[] = fromApiResponse(data, blacklist_array);
  return repos;
}
