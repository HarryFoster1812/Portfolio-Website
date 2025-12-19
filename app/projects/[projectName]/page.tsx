"use client";

import React, { useEffect, useState } from "react";
import MarkdownRenderer from "@/components/blog/markdown";
import ProjectRelatedPosts from "@/components/projects/project_related_posts";
import { Repo } from "@/lib/repos"; 

interface RepoWithContent extends Repo {
  content?: string;
}

export default function DynamicProjectPage({
  params,
}: {
  params: Promise<{ projectName: string }>;
}) {
  const [projectData, setProjectData] = useState<RepoWithContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { projectName } = await params;

        const res = await fetch(`/api/repos/${projectName}`);
        if (!res.ok) {
          if (res.status === 404) setError("🚫 Project Not Found (404)");
          else setError("⚠️ Failed to fetch project data");
          setLoading(false);
          return;
        }

        const data: RepoWithContent = await res.json();
        setProjectData(data);
      } catch {
        setError("⚠️ An error occurred while fetching project data");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-zinc-500 border-solid border-r-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-zinc-400 mt-20 min-h-[60vh] flex items-center justify-center px-4">
        <h1 className="text-3xl font-semibold">{error}</h1>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="text-center text-zinc-400 mt-20 min-h-[60vh] flex items-center justify-center px-4">
        <h1 className="text-3xl font-semibold">Project data is unavailable</h1>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 rounded-lg shadow-lg min-h-[80vh] text-zinc-300">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-zinc-100 tracking-tight">
          {projectData.name}
        </h1>
        {projectData.description && (
          <p className="mt-3 text-lg text-zinc-400">{projectData.description}</p>
        )}

        <a
          href={projectData.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-4 py-2 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors font-medium"
        >
          View on GitHub
        </a>

        <div className="mt-5 text-sm text-zinc-500 space-y-1">
          <p>
            Created:{" "}
            {new Date(projectData.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p>
            Last updated:{" "}
            {new Date(projectData.updatedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-zinc-100">Project README</h2>
        <div
          className="overflow-y-auto prose prose-invert prose-zinc"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#52525b transparent" }}
        >
          {projectData.content ? (
            <MarkdownRenderer markdown={projectData.content} />
          ) : (
            <p className="text-zinc-500 italic">No README content available.</p>
          )}
        </div>

        <ProjectRelatedPosts slug={projectData.name} />
      </section>
    </main>
  );
}
