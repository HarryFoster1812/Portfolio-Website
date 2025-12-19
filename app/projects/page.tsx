import ProjectsList from "@/components/projects/projects_list"

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore the portfolio projects of Harry Foster, including full-stack, frontend, backend, and systems programming projects.",
}

export default async function ProjectsPage() {
  return (
    <main className="max-w-8xl mx-auto p-8 space-y-8 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold text-center text-white tracking-wide drop-shadow-md">
        My Projects
      </h1>

      <ProjectsList />
    </main>
  );
}
