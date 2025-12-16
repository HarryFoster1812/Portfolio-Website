import Link from "next/link";
import { BlogPostMeta } from '@/lib/blog';

interface BlogCardProps {
    item: BlogPostMeta;
    spanClass?: string; 
    handleFilterClick: (type: 'tag' | 'series' | 'project', value: string) => void; 
}

export default function BlogCard({ item, spanClass = '', handleFilterClick }: BlogCardProps) {
    const postHref = `/blog/${item.filename}`;

    return (
        <div className={`group ${spanClass}`}>
            <div className="h-full flex flex-col p-6 border border-zinc-800 rounded-2xl shadow-sm transition-transform duration-300 ease-in-out hover:shadow-md hover:-translate-y-1">

                {/* --- Top Badges / Minimal --- */}
                <div className="flex gap-3 mb-4 items-start text-xs font-medium text-zinc-400 truncate">
                    {item.series && (
                        <a 
                            className="hover:text-teal-400 transition-colors truncate"
                            title={item.series.name}
                        >
                            📚 {item.series.part}{item.series.total ? `/${item.series.total}` : ''}
                        </a>
                    )}
                    {item.project && (
                        <a 
                            href={`/projects/${item.project.slug}`} 
                            className="hover:text-teal-400 transition-colors truncate"
                            title={item.project.name}
                        >
                            🔗 {item.project.name}
                        </a>
                    )}
                    {!item.series && !item.project && <span>Article</span>}
                </div>

                {/* --- Link wraps title + description --- */}
                <Link href={postHref} className="block flex-grow">
                    <h2 className="text-2xl font-bold text-zinc-100 mb-2 group-hover:text-teal-400 transition-colors line-clamp-2">
                        {item.title}
                    </h2>
                    <p className="text-zinc-400 mb-4 line-clamp-3">
                        {item.description}
                    </p>
                </Link>

                {/* --- Tags --- */}
                {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.slice(0, 3).map(tag => (
                            <button
                                key={tag}
                                onClick={(e) => { e.stopPropagation(); handleFilterClick('tag', tag); }}
                                className="text-xs font-medium text-teal-400 border border-zinc-700 px-2 py-1 rounded-full hover:bg-teal-400 hover:text-zinc-900 transition"
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                )}

                {/* --- Footer / Date + Read more --- */}
                <div className="flex justify-between items-center pt-4 border-t border-zinc-800 mt-auto text-sm text-zinc-500">
                    <p className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                    <Link href={postHref} className="flex items-center font-semibold text-teal-400 transition-transform duration-200 group-hover:text-teal-300 group-hover:translate-x-1">
                        Read more
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
