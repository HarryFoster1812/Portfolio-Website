"use client";
import { useState, useEffect } from "react";
import type { Repo } from "@/lib/repos";
import { sortRepos } from "@/lib/sort";

export default function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [sortedData, setSortedData] = useState<Repo[]>([]);
  const [sortType, setSortType] = useState<keyof Repo>("pushed_at");
  const [ascendingType, setAscendingType] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (repos.length > 0) {
      setSortedData(sortRepos([...repos], sortType, ascendingType));
    }
  }, [repos, sortType, ascendingType]);

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/repos");
        if (!res.ok) throw new Error("Failed to fetch repos");
        const data: Repo[] = await res.json();
        setRepos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  // Your existing JSX UI (unchanged, just replace repos with sortedData)

  return (
    <div className="max-w-8xl mx-auto p-8 space-y-8 rounded-lg shadow-lg">
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
            <option value="pushed_at">Updated Date</option>
            <option value="created_at">Created Date</option>
          </select>
        </label>

        <label className="flex flex-col text-sm text-zinc-400 font-medium">
          Order:
          <select
            className="mt-2 bg-zinc-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) =>
              setAscendingType(e.target.value as "asc" | "desc")
            }
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
<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))] gap-4">
          {sortedData.map((repo) => (
            <li key={repo.id} className="group w-full">
              <a
                href={`/projects/${repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-zinc-700 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-1 text-zinc-100 overflow-hidden relative"
              >
                {/* Language Badge */}
                <div className="absolute top-4 right-4">
                  {repo.language && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20">
                      {repo.language}
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 mb-2 w-2/3 truncate">
                    {repo.name}
                  </h2>
                  <p className="text-zinc-400 text-sm mb-4 line-clamp-3 min-h-[3.75rem]">
                    {repo.description ??
                      "A project showcasing my skills and creativity."}
                  </p>

                  {/* Dates */}
                  <div className="flex items-center justify-evenly min-w-full">
                    <p className="text-sm text-zinc-500 italic w-1/3">
                      Updated:{" "}
                      {new Date(repo.pushed_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-zinc-500 italic w-1/3">
                      Created:{" "}
                      {new Date(repo.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Subtle Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
