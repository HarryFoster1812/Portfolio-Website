"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ProjectPost {
  filename: string;
  title: string;
  description: string;
  date: string;
}

export default function ProjectRelatedPosts({
  slug,
  showEmptyState = false,
}: {
  slug: string;
  showEmptyState?: boolean;
}) {
  const [posts, setPosts] = useState<ProjectPost[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `/api/blog/projects/${encodeURIComponent(slug)}`
        );

        if (!res.ok) {
          setPosts([]);
          return;
        }

        const data: ProjectPost[] = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch project posts", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [slug]);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <section className="mt-20 animate-pulse space-y-4">
        <div className="h-4 w-48 rounded bg-zinc-800" />
        <div className="h-20 rounded bg-zinc-800" />
        <div className="h-20 rounded bg-zinc-800" />
      </section>
    );
  }

  /* ---------- No related posts ---------- */
  if (!posts || posts.length === 0) {
    if (!showEmptyState) return null;

    return (
      <section className="mt-20 border-t border-zinc-800 pt-10">
        <h2 className="mb-2 text-xl font-semibold text-zinc-100">
          Related Blog Posts
        </h2>
        <p className="text-sm text-zinc-500">
          No blog posts have been written about this project yet.
        </p>
      </section>
    );
  }

  /* ---------- Posts ---------- */
  return (
    <section className="mt-20 border-t border-zinc-800 pt-10">
      <h2 className="mb-6 text-2xl font-bold text-zinc-100">
        Related Blog Posts
      </h2>

      <div className="space-y-4">
        {posts.map(post => (
          <Link
            key={post.filename}
            href={`/blog/${post.filename}`}
            className="group block rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition hover:border-teal-500/50 hover:bg-zinc-900/70"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-teal-400 transition-colors">
                {post.title}
              </h3>
              <span className="text-xs text-zinc-500 tabular-nums">
                {new Date(post.date).toLocaleDateString()}
              </span>
            </div>

            {post.description && (
              <p className="mt-2 text-sm text-zinc-400">
                {post.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
