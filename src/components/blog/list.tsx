"use client"
import { useEffect, useState } from 'react';

type Post = {
  filename: string;
  title: string;
};

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch('/api/blog');
      const data: Post[] = await res.json();
      setPosts(data);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;

  return (
    <ul>
      {posts.map(({ filename, title }) => (
        <li key={filename}>{title}</li>
      ))}
    </ul>
  );
}
