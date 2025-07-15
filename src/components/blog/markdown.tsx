'use client';

import React, { useEffect, useRef, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import 'highlight.js/styles/atom-one-dark.css';
import { motion } from 'framer-motion';
import { parse } from 'yaml';

// Define props type
interface MarkdownRendererProps {
  markdown: string;
}

// Define frontmatter type
interface Frontmatter {
  title?: string;
  date?: string;
  description?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [frontmatter, setFrontmatter] = React.useState<Frontmatter>({});
  const [content, setContent] = React.useState<string>('');

  // Parse frontmatter and content
  useEffect(() => {
    const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (frontmatterMatch) {
      try {
        const frontmatterData = parse(frontmatterMatch[1]) as Frontmatter;
        setFrontmatter(frontmatterData);
        setContent(frontmatterMatch[2].trim());
      } catch (error) {
        console.error('Error parsing frontmatter:', error);
        setContent(markdown);
      }
    } else {
      setContent(markdown);
    }
  }, [markdown]);

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif',
    });

    const renderMermaid = async () => {
      if (mermaidRef.current) {
        const mermaidElements = mermaidRef.current.querySelectorAll('.mermaid');
        if (mermaidElements.length > 0) {
          await mermaid.run({
            nodes: mermaidElements,
            suppressErrors: true,
          });
        }
      }
    };

    renderMermaid();
  }, [content]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="prose dark:prose-invert max-w-none bg-[#1A1A1A] rounded-xl shadow-lg overflow-hidden"
      ref={mermaidRef}
    >
      {/* Header Section */}
      {(frontmatter.title || frontmatter.date || frontmatter.description) && (
        <div className="bg-[#1A1A1A] border-b border-gray-700 p-6">
          {frontmatter.title && (
            <h1 className="text-3xl font-bold mb-3 text-white">{frontmatter.title}</h1>
          )}
          {frontmatter.date && (
            <p className="text-sm text-gray-400">
              Published on{' '}
              {new Date(frontmatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
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
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            pre({ children }) {
              const child = children[0];
              if (
                React.isValidElement(child) &&
                child.props.className?.includes('language-mermaid')
              ) {
                return (
                  <div className="mermaid my-6 p-6 bg-gray-800 rounded-lg shadow-inner border border-gray-700">
                    {String(child.props.children).trim()}
                  </div>
                );
              }
              return (
                <pre className="bg-gray-800 text-white p-6 rounded-lg shadow-md overflow-x-auto my-6 border border-gray-700">
                  {children}
                </pre>
              );
            },
            code({ inline, className, children, ...props }) {
              return inline ? (
                <code
                  className="bg-gray-800 text-[#00ABE4] rounded-md px-2 py-1 font-mono text-sm"
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            h1: ({ children }) => (
              <h1 className="text-3xl font-extrabold mt-10 mb-6 text-white border-b border-gray-700 pb-2">
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
            p: ({ children }) => (
              <p className="my-5 text-gray-300 leading-relaxed">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-8 my-6 text-gray-300">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-8 my-6 text-gray-300">{children}</ol>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-[#00ABE4] pl-4 my-6 italic text-gray-400">
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-[#00ABE4] hover:text-[#ff4d4f] transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
};

export default memo(MarkdownRenderer);
