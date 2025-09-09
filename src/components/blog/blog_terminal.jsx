"use client"
import React, { useEffect, useRef, memo, useState } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import mermaid from "mermaid"
import "highlight.js/styles/atom-one-dark.css" // Keep this for code highlighting
import "katex/dist/katex.min.css"
import { motion } from "framer-motion"
import { parse } from "yaml"

// Error Boundary Component
const ErrorBoundary = ({ children }) => {
    const [error, setError] = useState(null)

    try {
        return <>{children}</>
    } catch (err) {
        setError(err.message || "An error occurred while rendering")
        return (
            <div className="p-4 bg-red-800 text-red-200 rounded-md" role="alert">
                Rendering Error: {error}
            </div>
        )
    }
}

const TerminalMarkdownRenderer = ({ markdown }) => {
    const mermaidRef = useRef(null)
    const [frontmatter, setFrontmatter] = useState({})
    const [content, setContent] = useState("")

    // Parse frontmatter and content
    useEffect(() => {
        const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
        if (frontmatterMatch) {
            try {
                const frontmatterData = parse(frontmatterMatch[1])
                setFrontmatter(frontmatterData)
                setContent(frontmatterMatch[2].trim())
            } catch (error) {
                console.error("Error parsing frontmatter:", error)
                setContent(markdown)
            }
        } else {
            setContent(markdown)
        }
    }, [markdown])

    // Initialize Mermaid
    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: "dark",
            securityLevel: "loose",
            fontFamily: "monospace" // Use monospace for a terminal feel
        })

        const renderMermaid = async () => {
            if (mermaidRef.current) {
                const mermaidElements = mermaidRef.current.querySelectorAll(".mermaid")
                if (mermaidElements.length > 0) {
                    try {
                        await mermaid.run({
                            nodes: mermaidElements,
                            suppressErrors: false
                        })
                    } catch (error) {
                        console.error("Mermaid rendering error:", error)
                    }
                } else {
                    console.warn("No Mermaid elements found")
                }
            }
        }

        renderMermaid()
    }, [content])

    return (
        <ErrorBoundary>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="prose dark:prose-invert max-w-none bg-[#1A1A1A] rounded-xl shadow-lg overflow-hidden font-mono"
                ref={mermaidRef}
            >
                {/* Header Section */}
                {(frontmatter.title || frontmatter.date || frontmatter.description) && (
                    <div className="bg-[#1A1A1A] border-b border-gray-800 p-6">
                        {frontmatter.title && (
                            <h1 className="text-3xl font-bold mb-3 text-white">
                                {frontmatter.title}
                            </h1>
                        )}
                        {frontmatter.date && (
                            <p className="text-sm text-gray-400">
                                Published on{" "}
                                {new Date(frontmatter.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                            </p>
                        )}
                        {frontmatter.description && (
                            <p className="mt-3 text-base text-gray-300 leading-relaxed">
                                {frontmatter.description}
                            </p>
                        )}
                    </div>
                )}

                {/* Markdown Content */}
                <div className="p-6">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
                        components={{
                            pre({ children }) {
                                const [isCopied, setIsCopied] = useState(false);
                                const preRef = useRef(null);
            
                                const handleCopy = () => {
                                    const textToCopy = preRef.current.innerText;
                                    navigator.clipboard.writeText(textToCopy).then(() => {
                                        setIsCopied(true);
                                        setTimeout(() => setIsCopied(false), 2000);
                                    }).catch(err => {
                                        console.error('Failed to copy text: ', err);
                                    });
                                };
            
                                const child = children[0]
                                if (
                                    React.isValidElement(child) &&
                                    child.props.className?.includes("language-mermaid")
                                ) {
                                    let mermaidCode = String(child.props.children).trim()
                                    mermaidCode = mermaidCode.replace(/^\/\/.*$/gm, "").trim()
                                    return (
                                        <div className="mermaid my-6 p-6 bg-gray-900 rounded-lg shadow-inner border border-gray-800">
                                            {mermaidCode}
                                        </div>
                                    )
                                }
            
                                return (
                                    <div className="relative my-6 group">
                                        <pre
                                            ref={preRef}
                                            className="bg-gray-900 text-green-400 p-5 rounded-lg shadow-xl overflow-x-auto border border-gray-800 text-sm leading-relaxed"
                                        >
                                            {children}
                                        </pre>
                                        <button
                                            onClick={handleCopy}
                                            className={`absolute top-2 right-2 p-1.5 rounded-md text-xs transition-all duration-200 ease-in-out
                                                ${isCopied ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}
                                                opacity-0 group-hover:opacity-100 focus:opacity-100 focus:ring-2 focus:ring-[#00ABE4] focus:outline-none`}
                                            title={isCopied ? "Copied!" : "Copy to clipboard"}
                                        >
                                            {isCopied ? '✅' : '📋'}
                                        </button>
                                    </div>
                                );
                            },
                            code({ inline, className, children, ...props }) {
                                if (inline) {
                                    return (
                                        <code
                                            className="bg-gray-800 text-green-300 rounded-md px-2 py-1 font-mono text-sm"
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    );
                                }
                                return (
                                    <>
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    </>
                                );
                            },
                            img({ src, alt }) {
                                return (
                                    <img
                                        src={src}
                                        alt={alt}
                                        className="my-6 rounded-lg shadow-md max-w-full h-auto mx-auto border border-gray-700"
                                        loading="lazy"
                                    />
                                )
                            },
                            p({ children }) {
                                const child = children[0]
                                if (
                                    React.isValidElement(child) &&
                                    child.type === "img" &&
                                    typeof child.props.src === "string" &&
                                    /\.(mp4|webm|ogg)$/i.test(
                                        child.props.src
                                    )
                                ) {
                                    return (
                                        <video
                                            controls
                                            className="my-6 rounded-lg shadow-md max-w-full h-auto mx-auto border border-gray-700"
                                        >
                                            <source
                                                src={child.props.src}
                                                type={`video/${child.props.src.split(".").pop()}`}
                                            />
                                            Your browser does not support the video tag.
                                        </video>
                                    )
                                }
                                return (
                                    <p className="my-5 text-gray-300 leading-relaxed">
                                        {children}
                                    </p>
                                )
                            },
                            h1: ({ children }) => (
                                <h1 className="text-3xl font-extrabold mt-10 mb-6 text-white border-b border-gray-800 pb-2">
                                    {children}
                                </h1>
                            ),
                            h2: ({ children }) => (
                                <h2 className="text-2xl font-bold mt-8 mb-4 text-white">
                                    {children}
                                </h2>
                            ),
                            h3: ({ children }) => (
                                <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-200">
                                    {children}
                                </h3>
                            ),
                            ul: ({ children }) => (
                                <ul className="list-disc pl-8 my-6 text-gray-300">
                                    {children}
                                </ul>
                            ),
                            ol: ({ children }) => (
                                <ol className="list-decimal pl-8 my-6 text-gray-300">
                                    {children}
                                </ol>
                            ),
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-gray-500 pl-4 my-6 italic text-gray-400">
                                    {children}
                                </blockquote>
                            ),
                            a: ({ href, children }) => (
                                <a
                                    href={href}
                                    className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {children}
                                </a>
                            )
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </motion.div>
        </ErrorBoundary>
    )
}

export default memo(TerminalMarkdownRenderer)
