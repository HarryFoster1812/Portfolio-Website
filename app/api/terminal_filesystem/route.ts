import { getAllBlogPosts } from '@/lib/blog';
import { fetchGitHubRepos, type Repo } from "@/lib/repos";

import { DirNode } from "@/lib/filesystem_types";

// Simulate dynamic fetching
async function fetchProjects() {
    const repos = await fetchGitHubRepos();
    return repos.map((repo: Repo) => ({
        slug: repo.name.toLowerCase().replace(/\s+/g, '-'),
    }));
}

async function fetchBlogPosts() {
    const posts = getAllBlogPosts();
    return posts.map(post => ({ slug: post.filename }));
}


function makeBlogNode(filename: string) {
    return {
        [`${filename}.md`]: {
            type: "blogFile",
        },
    };
}


function makeProjectNode(filename: string) {
    return {
        [`${filename}.md`]: {
            type: "projectFile",
        },
    };
}

export async function GET() {
    const projects = await fetchProjects();
    const blogs = await fetchBlogPosts();

    // Correctly initialize rootFS
    const rootFS: DirNode = {
        type: "dir",
        children: {
            blog: {
                type: "dir",
                children: {
                    "welcome.txt": {
                        type: "file",
                        content: "Welcome to my blog! Here's the first post...",
                    },
                },
            },
            "about.txt": {
                type: "file",
                content: "Hi, I’m Harry Foster. I build cool stuff.",
            },
            projects: { 
                type: "dir",
                children: {},
            },
        },
    };

    // Dynamically add blog posts to the rootFS structure
    blogs.forEach(blog => {
        const blogNode = makeBlogNode(blog.slug);
        const blogDir = rootFS.children.blog as DirNode
        Object.assign(blogDir, blogNode);
    });

    // Dynamically add project posts to the rootFS structure
    projects.forEach(project => {
        const projectNode = makeProjectNode(project.slug);
        const projectDir = rootFS.children.projects as DirNode
        Object.assign(projectDir, projectNode);
    });


    return new Response(JSON.stringify(rootFS), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

