'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import MarkdownRenderer from '@/components/blog/markdown';

export default function DynamicBlogPage() {
  const params = useParams();
  const articleName = Array.isArray(params?.articleName)
    ? params.articleName[0]
    : params?.articleName;

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!articleName) return;

    async function fetchPost() {
      try {
        const res = await fetch('/api/blog/' + articleName);
        if (!res.ok) {
          throw new Error('Post not found');
        }
        const data = await res.text();
        setContent(data);
      } catch {
        setContent('# 404 - Article not found');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [articleName]);

  if (loading) return <p className="text-center">Loading content...</p>;

  return <MarkdownRenderer markdown={content} />;
}
