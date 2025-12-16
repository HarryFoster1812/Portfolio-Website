"use client";
import { useEffect, useState } from "react";
import BlogCard from './blog_card';
import { assignResponsiveSpans, PostWithSpan } from '@/lib/blog-grid-utils';
import { BlogPostMeta } from '@/lib/blog';

const dummyFilterClick = () => {};

export default function FeaturedPostSection() {
    const [postsWithSpans, setPostsWithSpans] = useState<PostWithSpan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch("/api/blog/featured"); 
                const data: BlogPostMeta[] = await res.json();
                const withSpans = assignResponsiveSpans(data);
                setPostsWithSpans(withSpans);
            } catch (error) {
                console.error("Failed to fetch featured posts:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-32">
                <p className="text-zinc-400 italic text-center animate-pulse mb-3">Loading featured posts...</p>
                <div className="flex space-x-2">
                    <span className="w-3 h-3 bg-teal-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-3 h-3 bg-teal-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-3 h-3 bg-teal-400 rounded-full animate-bounce delay-225"></span>
                </div>
            </div>
        );
    }

    if (postsWithSpans.length === 0) return null;

    return (
        <section className="mt-8">
            <h1 className="text-4xl font-extrabold text-zinc-100 mb-8 border-b border-teal-500 pb-2">🌟 Featured Articles</h1>
            <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl w-full px-4">
                    {postsWithSpans.map(({ item }) => (
                        <BlogCard
                            key={item.filename}
                            item={item}
                            handleFilterClick={dummyFilterClick}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
