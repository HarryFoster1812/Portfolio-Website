import { metadata as baseMetadata } from "@/layout";
import { getRepoWithContent, type RepoWithContent } from "@/lib/repo_content";

interface Props {
  params: Promise<{ projectName: string }>
}

export async function generateMetadata({ params }: Props) {
  const { projectName } = await params;

  const repo: RepoWithContent | null = await getRepoWithContent(projectName);


  try {
    if (!repo) throw new Error("Repo not found");


    // Merge repo topics/language into base keywords
    const repoKeywords = [...(repo.topics ?? [])];
    if (repo.language) repoKeywords.push(repo.language);

    return {
      ...baseMetadata,
      title: `${repo.name} Project`,
      description: repo.description ?? `Project ${repo.name} by Harry Foster`,
        keywords: Array.from(
        new Set([
            ...(Array.isArray(baseMetadata.keywords) ? baseMetadata.keywords : []),
            ...(Array.isArray(repoKeywords) ? repoKeywords : []),
        ])
        ),
      openGraph: {
        ...baseMetadata.openGraph,
        title: repo.name,
        description: repo.description ?? `Project ${repo.name} by Harry Foster`,
        url: `https://harryfoster.tech/projects/${repo.name}`,
      },
      twitter: {
        ...baseMetadata.twitter,
        title: repo.name,
        description: repo.description ?? `Project ${repo.name} by Harry Foster`,
      },
    };
  } catch {
    return {
      ...baseMetadata,
      title: "Project Not Found",
      description: `No project found for "${projectName}"`,
    };
  }
}
