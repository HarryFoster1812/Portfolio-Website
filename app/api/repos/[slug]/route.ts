import { NextResponse } from "next/server";
import { getRepoWithContent } from "@/lib/repo_content"; // new shared lib function

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    console.log(`[Repo API] Request received for slug: "${slug}"`);


    const repo = await getRepoWithContent(slug);

    if (!repo) {
      console.warn(`[Repo API] Repository not found: "${slug}"`);
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(repo, { 
      status: 200,
      headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=86400" },
    });

  } catch (err) {
    console.error(`[Repo API] Unexpected error for "${slug}":`, err);
    return NextResponse.json({ message: "Error fetching repository content" }, { status: 500 });
  }
}
