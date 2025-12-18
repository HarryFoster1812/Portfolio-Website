"use client"

import { memo, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { BlogPostMeta } from "@/lib/blog";

import "katex/dist/katex.min.css"
import "highlight.js/styles/atom-one-dark.css" 

import "@/styles/blog.css"
import "@/styles/terminal-content.css"


type RenderMode = "regular" | "terminal"

interface PrebuiltMarkdownProps {
  html: string
  meta: BlogPostMeta
mode?: RenderMode
}

const WRAPPER_CLASS: Record<RenderMode, string> = {
  regular: "blog-content",
  terminal: "terminal-content",
}


const PrebuiltMarkdownRenderer = ({
  html,
  meta,
  mode = "regular",
}: PrebuiltMarkdownProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  /* ---------- Code copy buttons ---------- */
  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    root.querySelectorAll("pre").forEach(pre => {
      if (pre.querySelector("button")) return

      const btn = document.createElement("button")
      btn.textContent = "Copy"
      btn.className =
        "absolute top-2 right-2 p-2 bg-zinc-700 text-white rounded-md text-sm hover:bg-zinc-500 transition-colors"

      btn.onclick = async () => {
        await navigator.clipboard.writeText(pre.innerText)
        btn.textContent = "Copied!"
        setTimeout(() => (btn.textContent = "Copy"), 2000)
      }

      pre.appendChild(btn)
    })
  }, [html])


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={WRAPPER_CLASS[mode]}
    >
      <header className="meta-section mb-12 space-y-6 border-b border-neutral-800 pb-8">
        {/* Series / Project Row */}
        {(meta.series || meta.project) && (
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest">
            {meta.series && (
              <span className="rounded-full border border-teal-500/40 bg-teal-500/10 px-3 py-1 text-teal-400">
                {meta.series.name} · Part {meta.series.part}
              </span>
            )}

            {meta.project && (
              <Link
                href={`/projects/${meta.project.slug}`}
                className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
              >
                Project · {meta.project.name}
              </Link>
            )}
          </div>
        )}

        {/* Title */}
        {meta.title && (
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            {meta.title}
          </h1>
        )}

        {/* Description */}
        {meta.description && (
          <p className="max-w-3xl text-lg text-neutral-400">
            {meta.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500">
          {meta.date && (
            <span>
              Published{" "}
              <time dateTime={meta.date}>
                {new Date(meta.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </span>
          )}

          {meta.featured && (
            <span className="font-bold text-amber-400">
              ★ Featured
            </span>
          )}
        </div>

        {/* Tags */}
        {meta.tags && meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {meta.tags.map(tag => (
              <span
                key={tag}
                className="rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-semibold text-neutral-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* HTML content */}
      <div
        ref={containerRef}
        className="p-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </motion.div>
  )
}

export default memo(PrebuiltMarkdownRenderer)
