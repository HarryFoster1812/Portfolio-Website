import Link from "next/link";
import { BlogPostMeta } from "@/lib/blog";

interface FeaturedBlogCardProps {
    item: BlogPostMeta;
}

export default function FeaturedBlogCard({ item }: FeaturedBlogCardProps) {
    const postHref = `/blog/${item.filename}`;

    return (
        <article className="relative w-full rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 shadow-lg transition hover:shadow-xl">
            <div className="p-8 md:p-12 flex flex-col gap-6 max-w-5xl">

                {/* --- Meta row --- */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                    {item.series && (
                        <span
                            className="flex items-center gap-1"
                            title={item.series.name}
                        >
                            📚 Part {item.series.part}
                            {item.series.total && `/${item.series.total}`}
                        </span>
                    )}

                    {item.project && (
                        <Link
                            href={`/projects/${item.project.slug}`}
                            className="hover:text-teal-400 transition"
                        >
                            🔗 {item.project.name}
                        </Link>
                    )}

                    <span className="ml-auto flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        {new Date(item.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                </div>

                {/* --- Title + description --- */}
                <Link href={postHref} className="block group">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-100 leading-tight mb-3 group-hover:text-teal-400 transition-colors">
                        {item.title}
                    </h2>
                    <p className="text-lg text-zinc-400 leading-relaxed line-clamp-3">
                        {item.description}
                    </p>
                </Link>

                {/* --- Tags (display only) --- */}
                {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {item.tags.slice(0, 4).map(tag => (
                            <span
                                key={tag}
                                className="text-xs font-semibold text-teal-400 border border-zinc-700 px-3 py-1 rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* --- CTA --- */}
                <div className="pt-4">
                    <Link
                        href={postHref}
                        className="inline-flex items-center gap-2 text-base font-semibold text-teal-400 hover:text-teal-300 transition"
                    >
                        Read featured article
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 transition-transform group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </article>
    );
}
