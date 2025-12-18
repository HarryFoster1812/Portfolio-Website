import { NextResponse } from "next/server"
import { getAllBlogPosts } from '@/lib/blog'; 

export async function GET(
  req,
  { params }
) {
  try {
    const { slug } = await params

    const series_name = decodeURIComponent(slug).toLowerCase();



    // slug should be the title of the series
    const allPosts = await getAllBlogPosts();
    let filteredPosts = allPosts;

    console.log(allPosts)
    filteredPosts = allPosts
    .filter(post => {
        const name = post.series?.name;
        return typeof name === "string" &&
        name.toLowerCase().includes(series_name);
    })
    .map(post => ({
        filename: post.filename,
        title: post.title,
        description: post.description,
        date: post.date,
        series: {
        part: post.series.part
        }
    }))
    .sort((a, b) => a.series.part - b.series.part);

    return NextResponse.json(filteredPosts, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: "Error fetching series information" },
      { status: 400 }
    )
  }
}

