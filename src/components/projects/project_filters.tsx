"use client";

import { Dispatch, SetStateAction } from "react";
import type { Repo } from "@/lib/repos";

interface FiltersProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
  tag: string;
  setTag: Dispatch<SetStateAction<string>>;
  sortBy: keyof Repo;
  setSortBy: Dispatch<SetStateAction<keyof Repo>>;
  order: "asc" | "desc";
  setOrder: Dispatch<SetStateAction<"asc" | "desc">>;
  availableLanguages: string[];
  availableTopics: string[];
}

export default function Filters({
  search,
  setSearch,
  language,
  setLanguage,
  tag,
  setTag,
  sortBy,
  setSortBy,
  order,
  setOrder,
  availableLanguages,
  availableTopics,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-6">
      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-zinc-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-zinc-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Languages</option>
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      <select
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="bg-zinc-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Topics</option>
        {availableTopics.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as keyof Repo)}
        className="bg-zinc-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="name">Name</option>
        <option value="createdAt">Created Date</option>
        <option value="updatedAt">Updated Date</option>
        <option value="stars">Stars</option>
      </select>

      <select
        value={order}
        onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
        className="bg-zinc-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>
  );
}

