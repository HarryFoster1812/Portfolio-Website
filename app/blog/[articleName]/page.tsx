'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import MarkdownRenderer from '@/components/blog/markdown';
import { motion } from 'framer-motion';
import CommentSection from '@/components/blog/comment_section'

// Define types for better type safety
interface BlogPost {
  content: string;
  error?: string;
}

export default function DynamicBlogPage() {
  const params = useParams();
  const articleName = Array.isArray(params?.articleName)
    ? params.articleName[0]
    : params?.articleName;

  const [post, setPost] = useState<BlogPost>({ content: '' });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPost = useCallback(async () => {
    if (!articleName) {
      setPost({ content: '# 404 - Article not found', error: 'No article name provided' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/blog/${encodeURIComponent(articleName)}`, {
        headers: {
          'Accept': 'text/plain',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.text();
      setPost({ content: data });
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setPost({ content: '# 404 - Article not found', error: error.message });
    } finally {
      setLoading(false);
    }
  }, [articleName]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-screen"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <MarkdownRenderer markdown={post.content} />
        <CommentSection slug={encodeURIComponent(articleName)}/>
      {post.error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md" role="alert">
          Error: {post.error}
        </div>
      )}
    </motion.div>
  );
}
