import type { Repo } from "./repos";

export function sortRepos(
  repos: Repo[],
  sortType: keyof Repo,
  ascendingType: "asc" | "desc"
): Repo[] {
  return repos.sort((a, b) => {
    const aValue = a[sortType];
    const bValue = b[sortType];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return ascendingType === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return ascendingType === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });
}
