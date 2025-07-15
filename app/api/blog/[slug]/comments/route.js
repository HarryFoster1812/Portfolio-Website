import { NextResponse } from "next/server"
import mongoose from "mongoose"
import { connectDB } from "@/lib/mongoose"

const commentSchema = new mongoose.Schema({
  slug: { type: String, required: true }, // Blog post
  name: { type: String, required: true },
  body: { type: String, required: true },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null
  },
  createdAt: { type: Date, default: Date.now }
})

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema)

export async function GET(
  req,
  { params }
) {
  try {
    await connectDB()

    const { slug } = await params

    const comments = await Comment.find({ slug: slug })
      .sort({ createdAt: 1 })
      .lean()

    // Structure into tree
    const commentMap = new Map()
    const rootComments = []

    for (const comment of comments) {
      comment.replies = []
      commentMap.set(comment._id.toString(), comment)
    }

    for (const comment of comments) {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId.toString())
        if (parent) parent.replies.push(comment)
      } else {
        rootComments.push(comment)
      }
    }

    return NextResponse.json(rootComments, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: "Error loading comments" },
      { status: 500 }
    )
  }
}

export async function POST(req, { params }) {
  const { name, body, parentId } = await req.json()

  if (!name || !body) {
    return NextResponse.json(
      { message: "Missing name or comment body" },
      { status: 400 }
    )
  }

  try {
    await connectDB()

    await Comment.create({
      slug: params.slug,
      name,
      body,
      parentId: parentId || null,
      confirmed: false
    })

    return NextResponse.json({ message: "Comment submitted." }, { status: 201 })
  } catch (error) {
    console.error("Error posting comment:", error)
    return NextResponse.json(
      { message: "Error posting comment" },
      { status: 500 }
    )
  }
}
