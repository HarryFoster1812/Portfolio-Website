"use client";

import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  updated_at: string;
  created_at: string;
  message?: string;
}

export default function DynamicProjectPage({
  params,
}: {
  params: Promise<{ projectName: string }>;
}) {
  const [projectData, setProjectData] = useState<GitHubRepo | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { projectName } = await params;

        const data = await fetch(
          `https://api.github.com/repos/HarryFoster1812/${projectName}`
        );
        const json_data: GitHubRepo = await data.json();

        if (json_data.message === "Not Found") {
          setError("🚫 Project Not Found (404)");
          setLoading(false);
          return;
        }

        setProjectData(json_data);

        const mdData = await fetch(
          `https://raw.githubusercontent.com/HarryFoster1812/${projectName}/main/README.md`
        );
        if (mdData.ok) {
          const mdText = await mdData.text();
          setMarkdownContent(mdText);
        } else {
          setError("⚠️ README.md not found");
        }
      } catch {
        setError("⚠️ An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <div className="text-center text-zinc-400 mt-20  min-h-[60vh] flex items-center justify-center px-4">
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
    <main className="max-w-4xl mx-auto px-6 py-12  rounded-lg shadow-lg min-h-[80vh] text-zinc-300">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-zinc-100 tracking-tight">
                    {projectData.name}
                </h1>
                <p className="mt-3 text-lg text-zinc-400">{projectData.description}</p>

                {/* GitHub repo link */}
                <a
                    href={`https://github.com/HarryFoster1812/${projectData.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-4 py-2 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors font-medium"
                >
                    View on GitHub
                </a>

                <div className="mt-5 text-sm text-zinc-500 space-y-1">
                    <p>
                        Created:{" "}
                        {new Date(projectData.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                    <p>
                        Last updated:{" "}
                        {new Date(projectData.updated_at).toLocaleDateString(undefined, {
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
          className="max-h-[60vh] overflow-y-auto prose prose-invert prose-zinc"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#52525b transparent" }}
        >
          {markdownContent ? (
            <Markdown>{markdownContent}</Markdown>
          ) : (
            <p className="text-zinc-500 italic">No README.md content available.</p>
          )}
        </div>
      </section>
    </main>
  );
}
