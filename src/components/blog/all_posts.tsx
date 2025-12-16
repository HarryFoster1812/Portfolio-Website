// components/blog/AllPostsSection.tsx (Revised)
"use client";
import { useEffect, useState, useCallback } from "react";
import BlogCard from './blog_card';
// Assuming this path and type definition is correct
import { BlogPostMeta } from '@/lib/blog'; 

type AvailableFilter = { name: string, slug: string };

type AllPostsResponse = {
    posts: BlogPostMeta[];
    totalPages: number;
    currentPage: number;
    availableTags?: string[];
    availableSeries?: string[]; 
    availableProjectSlugs?: AvailableFilter[];
};

type StringSetter = React.Dispatch<React.SetStateAction<string>>;
type StringOrNullSetter = React.Dispatch<React.SetStateAction<string | null>>;

export default function AllPostsSection() {
    const [postsData, setPostsData] = useState<AllPostsResponse>({ 
        posts: [],
        totalPages: 1,
        currentPage: 1,
        availableTags: [],
        availableSeries: [],
        availableProjectSlugs: []
    });
    const [loading, setLoading] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // State for filtering and searching
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const [seriesSlug, setSeriesSlug] = useState(''); 
    const [projectSlug, setProjectSlug] = useState(''); 

    const LIMIT = 9;


    const fetchPosts = useCallback(async () => {
        setLoading(true);

        const params = new URLSearchParams({
            page: String(page),
            limit: String(LIMIT),
        });
        
        // Append all active filters/search queries to the API request
        if (searchQuery) params.append('search', searchQuery);
        if (activeTag) params.append('tag', activeTag);
        // Pass the slug for filtering
        if (seriesSlug) params.append('series', seriesSlug); 
        if (projectSlug) params.append('project', projectSlug);

        try {
            const res = await fetch(`/api/blog/search?${params.toString()}`);
            const data: AllPostsResponse = await res.json();
            setPostsData(data);
        } catch (error) {
            console.error("Failed to fetch all posts:", error);
        } finally {
            setLoading(false);
        }
    }, [page, searchQuery, activeTag, seriesSlug, projectSlug]); // Dependency array updated

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);


    // Helper for states that accept ONLY a string (search, series, project)
    const handleStringFilterChange = (setter: StringSetter, value: string) => {
        setter(value);
        setPage(1);
    };

    // Helper for states that accept a string OR null (tag)
    const handleStringOrNullFilterChange = (setter: StringOrNullSetter, value: string | null) => {
        setter(value);
        setPage(1);
    };


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleStringFilterChange(setSearchQuery, e.target.value);
    };

    // Handler for clicks/select changes
    const handleFilterClick = (_type: 'tag' | 'series' | 'project', value: string) => {
        if (_type === 'tag') {
            // Pass the string OR null result to the string|null handler
            handleStringOrNullFilterChange(setActiveTag, value === activeTag ? null : value); 
        } else if (_type === 'series') {
            // Pass the string value to the string handler
            handleStringFilterChange(setSeriesSlug, value); 
        } else if (_type === 'project') {
            // Pass the string value to the string handler
            handleStringFilterChange(setProjectSlug, value);
        }
    };

    // Reset all filters (utility function for clarity)
    const resetAllFilters = () => {
        setSearchQuery('');
        setActiveTag(null);
        setSeriesSlug(''); // Reset to empty string
        setProjectSlug(''); // Reset to empty string
        setPage(1);
    };


    return (
        <section className="mt-12">
            <h1 className="text-4xl font-extrabold text-zinc-100 mb-8 border-b border-teal-500 pb-2">The Archive</h1>

            {/* --- 1. Filter and Search Bar Container (Sticky) --- */}
            <div className="sticky top-0 bg-zinc-900/90 backdrop-blur-md z-10 py-4 mb-4 border-b border-zinc-800">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Primary Search Input */}
                    <input
                        type="text"
                        placeholder="Search titles and descriptions..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="flex-grow p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:ring-teal-500 focus:border-teal-500"
                    />

                    {/* Filter Toggle Button */}
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex-shrink-0 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-500 transition shadow-md flex items-center justify-center gap-2"
                    >
                        {isFilterOpen ? 'Close Filters' : 'More Filters'}
                        {/* Filter Icon SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* --- 2. Collapsible Filter Drawer --- */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isFilterOpen ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
                <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Filter A: Tag Dropdown */}
                    <div>
                        <label htmlFor="tag-filter" className="block text-sm font-medium text-zinc-300 mb-2">Filter by Tag</label>
                        <select
                            id="tag-filter"
                            value={activeTag || ''}
                            onChange={(e) => handleFilterClick('tag', e.target.value)}
                            className="w-full p-3 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-100 focus:ring-teal-500 focus:border-teal-500 appearance-none"
                        >
                            <option value="">-- All Tags --</option>
                            {postsData.availableTags?.map(tag => (
                                <option key={tag} value={tag}>{tag}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filter B: Series Dropdown (Uses name as display, slug as value) */}
                    <div>
                        <label htmlFor="series-filter" className="block text-sm font-medium text-zinc-300 mb-2">Filter by Series</label>
                        <select
                            id="series-filter"
                            value={seriesSlug}
                            onChange={(e) => handleFilterClick('series', e.target.value)}
                            className="w-full p-3 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-100 focus:ring-teal-500 focus:border-teal-500 appearance-none"
                        >
                            <option value="">-- All Series --</option>
                            {postsData.availableSeries?.map(series => (
                                <option key={series} value={series}>{series}</option> 
                            ))}
                        </select>
                    </div>

                    {/* Filter C: Project Dropdown (Uses name as display, slug as value) */}
                    <div>
                        <label htmlFor="project-filter" className="block text-sm font-medium text-zinc-300 mb-2">Filter by Project</label>
                        <select
                            id="project-filter"
                            value={projectSlug}
                            onChange={(e) => handleFilterClick('project', e.target.value)}
                            className="w-full p-3 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-100 focus:ring-teal-500 focus:border-teal-500 appearance-none"
                        >
                            <option value="">-- All Projects --</option>
                            {postsData.availableProjectSlugs?.map(project => (
                                // The value sent to the API is the project slug
                                <option key={project.slug} value={project.slug}>{project.name}</option>
                            ))}
                        </select>
                        
                        {/* Reset button is better placed outside the column layout for full width action */}
                    </div>
                    
                    {/* Reset button outside the grid for a clearer, standalone action */}
                    <div className="md:col-span-3">
                        <button
                            onClick={resetAllFilters}
                            className="mt-4 w-full py-2 text-sm font-semibold text-red-400 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition"
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* --- 3. Posts Grid --- */}
            {loading ? (
                // ... (Loading state)
                <div className="text-center text-zinc-400 py-20">
                    <p className="animate-pulse">Fetching articles...</p>
                </div>
            ) : postsData.posts.length === 0 ? (
                // ... (No results state)
                 <div className="text-center text-zinc-400 py-20">
                    No articles found matching your current filters. Try clearing your search or tags.
                </div>
            ) : (
                // Grid Display
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {postsData.posts.map(post => (
                        <BlogCard 
                            key={post.filename} 
                            item={post} 
                            // Pass the handler down to the card so clicking a tag on the card activates the main filter
                            handleFilterClick={handleFilterClick} 
                        />
                    ))}
                </div>
            )}

            {/* --- 4. Pagination Controls --- */}
            {postsData.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                        className="px-4 py-2 bg-zinc-800 text-teal-400 rounded-lg disabled:opacity-50 hover:bg-zinc-700 transition"
                    >
                        Previous
                    </button>
                    <span className="text-zinc-400">
                        Page <i>{postsData.currentPage}</i> of <i>{postsData.totalPages}</i>
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(postsData.totalPages, p + 1))}
                        disabled={page === postsData.totalPages || loading}
                        className="px-4 py-2 bg-zinc-800 text-teal-400 rounded-lg disabled:opacity-50 hover:bg-zinc-700 transition"
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
}
