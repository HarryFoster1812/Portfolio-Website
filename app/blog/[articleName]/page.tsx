import { notFound } from "next/navigation";
import PrebuiltMarkdownRenderer from "@/components/blog/prebuilt_markdown";
import CommentSection from "@/components/blog/comment_section";
import { SubscribeSection } from "@/components/subscribe/subscribeSection";
import SeriesNavigation from "@/components/blog/series_navigation";
import type { BlogPostMeta } from "@/lib/blog";

import { metadata as baseMetadata } from "@/layout"; 

interface PostModule {
  html: string;
  meta: BlogPostMeta;
}

interface Props {
  params:  Promise<{ articleName: string }>
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams.articleName)
    ? resolvedParams.articleName[0]
    : resolvedParams.articleName;

  try {
    const postModule: { meta: BlogPostMeta } = await import(
      `@/generated/posts/${slug}`
    );

    const postTags = postModule.meta.tags ?? [];
    const keywords = Array.from(
        new Set([
        ...(Array.isArray(baseMetadata.keywords) ? baseMetadata.keywords : []),
        ...(Array.isArray(postTags) ? postTags : []),
        ])
    );

    return {
      ...baseMetadata, // start with the layout base
      title: postModule.meta.title,
      description: postModule.meta.description,
      keywords,
    };
  } catch {
    return {...baseMetadata, title: "Article Not Found"}; // fallback if post metadata fails
  }
}

// Server-side blog page
export default async function BlogPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams.articleName)
    ? resolvedParams.articleName[0]
    : resolvedParams.articleName;

  try {
    const postModule: PostModule = await import(`@/generated/posts/${slug}`);

    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <PrebuiltMarkdownRenderer html={postModule.html} meta={postModule.meta} />
        {postModule.meta.series && <SeriesNavigation meta={postModule.meta} />}
        <CommentSection slug={encodeURIComponent(slug)} />
        <SubscribeSection variant="blog" />
      </div>
    );
  } catch {
        notFound();
  }
}

