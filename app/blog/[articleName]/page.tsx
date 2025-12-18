"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import PrebuiltMarkdownRenderer from "@/components/blog/prebuilt_markdown"
import CommentSection from "@/components/blog/comment_section"
import { SubscribeSection } from "@/components/subscribe/subscribeSection"
import SeriesNavigation from "@/components/blog/series_navigation"

interface PostModule {
  html: string
  meta?: {
    title?: string
    date?: string
    description?: string
  }
}

export default function DynamicBlogPage() {
  const params = useParams()
  const articleName: string = Array.isArray(params?.articleName)
    ? params.articleName[0]
    : params?.articleName ?? ""

  const [post, setPost] = useState<PostModule | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!articleName) {
      setError("No article name provided")
      setLoading(false)
      return
    }

    import(`@/generated/posts/${articleName}`)
      .then(mod => {
        setPost(mod)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error loading post module:", err)
        setError("Article not found")
        setLoading(false)
      })
  }, [articleName])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="p-6 bg-red-100 text-red-700 rounded-md">
          {error || "404 - Article not found"}
        </div>
      </div>
    )
  }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <PrebuiltMarkdownRenderer html={post.html} meta={post.meta} />
            {post.meta.series && <SeriesNavigation meta={post.meta}/>}
            <CommentSection slug={encodeURIComponent(articleName)} />
            <SubscribeSection variant="blog" />
        </div>
    )
}
