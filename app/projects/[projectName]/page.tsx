import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/blog/markdown";
import ProjectRelatedPosts from "@/components/projects/project_related_posts";
import { getRepoWithContent, type RepoWithContent } from "@/lib/repo_content";

export {generateMetadata} from "./generateMetadata";

interface Props {
  params: Promise<{ projectName: string }>;
}

export default async function DynamicProjectPage({ params }: Props) {
  const { projectName } = await params;

  const projectData: RepoWithContent | null = await getRepoWithContent(projectName);

  if (!projectData) {
    notFound();
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
