"use client"

import { memo, useEffect, useRef } from "react"
import { motion } from "framer-motion"

import "katex/dist/katex.min.css"
import "highlight.js/styles/atom-one-dark.css" 

import "@/styles/blog.css"
import "@/styles/terminal-content.css"


type RenderMode = "regular" | "terminal"

interface PrebuiltMarkdownProps {
  html: string
  meta?: {
    title?: string
    date?: string
    description?: string
  }
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
      {/* Header */}
      {(meta?.title || meta?.date || meta?.description) && (
        <div className="meta-section">
          {meta?.title && (
            <h1 >
              {meta.title}
            </h1>
          )}

          {meta?.date && (
            <p >
              Published on{" "}
              {new Date(meta.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          {meta?.description && (
            <p>
              {meta.description}
            </p>
          )}
        </div>
      )}

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
