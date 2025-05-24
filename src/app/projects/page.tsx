"use client";
import { useState, useEffect } from "react";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  updated_at: string;
  created_at: string;
}

function sort(json_data: Repo[], sortType: keyof Repo, ascendingType: string) {
  return json_data.sort((a, b) => {
    const aValue = a[sortType];
    const bValue = b[sortType];

    if (typeof aValue === "string" && typeof bValue === "string") {
      if (ascendingType === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      if (ascendingType === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    }

    return 0;
  });
}

export default function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [sortedData, setSortedData] = useState<Repo[]>([]);
  const [sortType, setSortType] = useState<keyof Repo>("updated_at");
  const [ascendingType, setAscendingType] = useState("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (repos.length > 0) {
      const sorted = sort([...repos], sortType, ascendingType);
      setSortedData(sorted);
    }
  }, [sortType, ascendingType, repos]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/HarryFoster1812/repos"
        );
        const data: Repo[] = await response.json();

        setRepos(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8  rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold text-center text-white tracking-wide drop-shadow-md">
        My Projects
      </h1>

      <div className="flex justify-center gap-6 flex-wrap">
        <label className="flex flex-col text-sm text-zinc-400 font-medium">
          Sort by:
          <select
            className="mt-2 bg-zinc-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => setSortType(e.target.value as keyof Repo)}
            value={sortType}
          >
            <option value="name">Name</option>
            <option value="updated_at">Updated Date</option>
            <option value="created_at">Created Date</option>
          </select>
        </label>

        <label className="flex flex-col text-sm text-zinc-400 font-medium">
          Order:
          <select
            className="mt-2 bg-zinc-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => setAscendingType(e.target.value)}
            value={ascendingType}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p className="text-center text-zinc-400 italic">Loading projects...</p>
      ) : sortedData.length === 0 ? (
        <p className="text-center text-zinc-400 italic">No projects found.</p>
      ) : (
        <ul className="space-y-6">
          {sortedData.map((repo) => (
            <li key={repo.id}>
              <a
                href={`/projects/${repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className=" block bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 border border-zinc-600 rounded-lg p-4 shadow-md hover:shadow-blue-500/20 transition-all duration-300 text-white"
              >

                <h2 className="text-2xl font-semibold text-white mb-2">
                  {repo.name}
                </h2>
                <p className="text-zinc-300 mb-3 leading-relaxed min-h-[3rem]">
                  {repo.description ?? "No description provided."}
                </p>
                <p className="text-xs text-zinc-500 italic tracking-wide">
                  Updated:{" "}
                  {new Date(repo.updated_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-zinc-500 italic tracking-wide">
                  Created:{" "}
                  {new Date(repo.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
