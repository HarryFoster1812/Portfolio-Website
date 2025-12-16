// Query Params	page, limit, search, tag, series, project

import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/blog'; 
import { BlogPostMeta } from '@/lib/blog';


type AllPostsResponse = {
    posts: BlogPostMeta[];
    totalPages: number;
    currentPage: number;
    availableTags?: string[];
    availableSeries?: string[]; 
    availableProjectSlugs?: { name: string, slug: string }[];
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    // Pagination Parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Filtering/Search Parameters
    const search = searchParams.get('search')?.toLowerCase() || null;
    const tag = searchParams.get('tag')?.toLowerCase() || null;
    const series = searchParams.get('series')?.toLowerCase() || null;
    const project = searchParams.get('project')?.toLowerCase() || null;

    if (page < 1 || limit < 1) {
        return NextResponse.json({ error: 'Invalid page or limit parameter' }, { status: 400 });
    }

    // Fetch all posts
    const allPosts: BlogPostMeta[] = await getAllBlogPosts();

    // Sort the posts by date (newest first)
    allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Start filtering from the full list
    let filteredPosts: BlogPostMeta[] = allPosts;


    // Filter by search query (title or description)
    if (search) {
        filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(search) || 
            post.description.toLowerCase().includes(search)
        );
    }

    // Filter by tag
    if (tag) {
        filteredPosts = filteredPosts.filter(post => 
            post.tags?.some(t => t.toLowerCase() === tag)
        );
    }

    // Filter by series name (or slug)
    if (series) {
        filteredPosts = filteredPosts.filter(post => 
            post.series?.name.toLowerCase().includes(series)
        );
    }

    // Filter by project slug
    if (project) {
        filteredPosts = filteredPosts.filter(post => 
            post.project?.slug.toLowerCase() === project
        );
    }
    
    // Tags are extracted from the filtered list to keep the filter bar contextual
    const allUniqueTags: Set<string> = new Set<string>();
    filteredPosts.forEach(post => {
        post.tags?.forEach(t => allUniqueTags.add(t));
    });
    const availableTags = Array.from(allUniqueTags).sort();


    const seriesSet:Set<string> =  new Set<string>();
    filteredPosts.forEach(post => {
        if (post.series) {
            seriesSet.add(post.series.name)
        }
    });
    const availableSeriesSlugs = Array.from(seriesSet).sort();


    // Extract Projects (COMPLETE THIS BLOCK)
    const projectsMap = new Map<string, { name: string, slug: string }>();
    filteredPosts.forEach(post => {
        if (post.project) {
            // Using the slug as the key ensures uniqueness
            projectsMap.set(post.project.slug.toLowerCase(), {
                name: post.project.name,
                slug: post.project.slug.toLowerCase()
            });
        }
    });
    const availableProjectSlugs = Array.from(projectsMap.values()).sort((a, b) => a.name.localeCompare(b.name));


    // Apply Pagination
    const totalCount = filteredPosts.length;
    const totalPages = Math.ceil(totalCount / limit);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const postsForPage = filteredPosts.slice(startIndex, endIndex);

    // 6. Construct and return the final response
    const response: AllPostsResponse = {
        posts: postsForPage,
        totalPages: totalPages,
        currentPage: page,
        availableTags: availableTags,
        availableSeries: availableSeriesSlugs,
        availableProjectSlugs: availableProjectSlugs
    };

    return NextResponse.json(response);
}
