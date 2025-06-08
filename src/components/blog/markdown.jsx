'use client';

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github.css';
import mermaid from 'mermaid';

export default function MarkdownRenderer({ markdown } ) {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.init(undefined, document.querySelectorAll('.mermaid'));
  }, [markdown]);

  return (
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
            return <div className="mermaid">{String(child.props.children).trim()}</div>;
          }
          return <pre>{children}</pre>;
        },
        code({ inline, className, children, ...props }) {
          return !inline ? (
            <pre>
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          ) : (
            <code {...props}>{children}</code>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
