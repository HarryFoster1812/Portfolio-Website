import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const cache = {}

export async function GET(request, context) {
  const params = await context.params
  const { slug } = params

  if (cache[slug]) {
    return new NextResponse(cache[slug], {
      status: 200,
      headers: { "Content-Type": "text/markdown" }
    })
  }

  try {
    const filePath = path.join(process.cwd(), "src/content/blog", `${slug}.md`)
    const fileContent = await fs.readFile(filePath, "utf8")
    cache[slug] = fileContent
    return new NextResponse(fileContent, {
      status: 200,
      headers: { "Content-Type": "text/markdown" }
    })
  } catch {
    return new NextResponse("Blog post not found", {
      status: 404,
      headers: { "Content-Type": "text/plain" }
    })
  }
}
