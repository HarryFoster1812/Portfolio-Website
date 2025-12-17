import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkRehype from "remark-rehype"
import rehypeRaw from "rehype-raw"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import rehypeStringify from "rehype-stringify"

const POSTS_DIR = path.join(process.cwd(), "src/content/blog")
const OUTPUT_DIR = path.join(process.cwd(), "src/generated/posts")
const META_OUTPUT_FILE = path.join(process.cwd(), "src/generated/postsMeta.ts")

// Ensure output folder exists
fs.mkdirSync(OUTPUT_DIR, { recursive: true })

type PostMeta = {
  filename: string
  title: string
  description: string
  date: string
  tags?: string[]
  featured?: boolean
  series?: { name: string; part: number; total?: number }
  project?: { name: string; slug: string }
}

async function generate() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".md"))
  const metaData: PostMeta[] = []

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file)
    const source = fs.readFileSync(filePath, "utf8")

    // Extract frontmatter
    const { data, content } = matter(source)

    // Parse Markdown → HTML
    const html = String(
      await remark()
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeHighlight)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(content)
    )

    // Generate JS module for the post
    const slug = file.replace(/\.md$/, "")
    const postOutput = `
      export const meta = ${JSON.stringify(data)};
      export const html = ${JSON.stringify(html)};
    `
    fs.writeFileSync(path.join(OUTPUT_DIR, `${slug}.ts`), postOutput)
    console.log(`Generated post: ${slug}.ts`)

    // Collect metadata for global meta file
    metaData.push({
      filename: slug,
      title: String(data.title ?? "Untitled"),
      description: String(data.description ?? ""),
      date: String(data.date ?? ""),
      tags: data.tags ?? [],
      featured: Boolean(data.featured),
      series: data.series,
      project: data.project,
    })
  }

  // Generate metadata file
  const metaFileContent = `
    export type BlogPostMeta = {
      filename: string;
      title: string;
      description: string;
      date: string;
      tags?: string[];
      featured?: boolean;
      series?: { name: string; part: number; total?: number };
      project?: { name: string; slug: string };
    };
    
    export const allPosts: BlogPostMeta[] = ${JSON.stringify(
      metaData.sort((a, b) => +new Date(b.date) - +new Date(a.date))
    , null, 2)};
  `
  fs.writeFileSync(META_OUTPUT_FILE, metaFileContent)
  console.log(`Generated metadata file: postsMeta.ts`)
}

generate().catch(err => {
  console.error(err)
  process.exit(1)
})
