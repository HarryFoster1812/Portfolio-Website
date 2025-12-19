"use client";

import { useState, useEffect } from "react";
import type { Repo } from "@/lib/repos";
import Filters from "./project_filters";

type SearchResponse = {
  repos: Repo[];
  totalPages: number;
  currentPage: number;
  availableLanguages: string[];
  availableTopics: string[];
};

export default function ProjectsList() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [tag, setTag] = useState("");
  const [sortBy, setSortBy] = useState<keyof Repo>("updatedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);

  const fetchRepos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        search,
        language,
        tag,
        sort: sortBy,
        order,
      });
      const res = await fetch(`/api/repos/search?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch repos");
      const data: SearchResponse = await res.json();

      setRepos(data.repos);
      setTotalPages(data.totalPages);
      setAvailableLanguages(data.availableLanguages);
      setAvailableTopics(data.availableTopics);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, [search, language, tag, sortBy, order, page]);

  return (
    <div className="space-y-8">
      <Filters
        search={search}
        setSearch={setSearch}
        language={language}
        setLanguage={setLanguage}
        tag={tag}
        setTag={setTag}
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
        availableLanguages={availableLanguages}
        availableTopics={availableTopics}
      />

      {loading ? (
        <p className="text-center text-zinc-400 italic">Loading projects...</p>
      ) : repos.length === 0 ? (
        <p className="text-center text-zinc-400 italic">No projects found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((repo) => (
            <li key={repo.name} className="group w-full">
              <a
                href={`/projects/${repo.name}`}
                className="block bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-zinc-700 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-300 transform hover:-translate-y-1 text-zinc-100 overflow-hidden relative"
              >
                {repo.language && (
                  <span className="absolute top-4 right-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20">
                    {repo.language}
                  </span>
                )}

                <h2 className="text-xl font-bold text-zinc-100 mb-2 w-2/3 truncate">
                  {repo.name}
                </h2>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-3 min-h-[3.75rem]">
                  {repo.description ?? "A project showcasing my skills and creativity."}
                </p>

                <div className="flex justify-between text-sm text-zinc-500 italic">
                  <span>Updated: {new Date(repo.updatedAt).toLocaleDateString()}</span>
                  <span>Created: {new Date(repo.createdAt).toLocaleDateString()}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-zinc-700 rounded-md text-white disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2 text-zinc-300">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-zinc-700 rounded-md text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
