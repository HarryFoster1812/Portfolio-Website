// api/blog/projects/[slug]
// Given a project name (for use on the projects page)
// It will return a list of blog posts which have the project meta-data / slug


import { NextResponse } from "next/server"
import { getAllBlogPosts } from '@/lib/blog'; 

export async function GET(
  req,
  { params }
) {
  try {
    const { slug } = await params

    const project_slug = decodeURIComponent(slug).toLowerCase();



    // slug should be the slug of the project
    const allPosts = await getAllBlogPosts();
    let filteredPosts = allPosts;

    console.log(allPosts)
    filteredPosts = allPosts
    .filter(post => {
        const name = post.project?.slug;
        return typeof name === "string" &&
        name.toLowerCase().includes(project_slug);
    })
    .map(post => ({
        filename: post.filename,
        title: post.title,
        description: post.description,
        date: post.date,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(filteredPosts, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: "Error fetching series information" },
      { status: 400 }
    )
  }
}

