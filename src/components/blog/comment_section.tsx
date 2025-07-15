'use client';

import { useEffect, useState } from 'react';

interface Comment {
  _id: string;
  name: string;
  body: string;
  createdAt: string;
  parentId: string | null;
  replies?: Comment[];
}

interface CommentSectionProps {
  slug: string;
}

export default function CommentSection({ slug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', body: '', parentId: null as string | null });
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/blog/${slug}/comments`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.body.trim()) return;

    setSubmitting(true);

    const res = await fetch(`/api/blog/${slug}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const updatedRes = await fetch(`/api/blog/${slug}/comments`);
      const updatedComments = await updatedRes.json();
      setComments(updatedComments);
      setForm({ name: '', body: '', parentId: null });
      setReplyingTo(null);
    }

    setSubmitting(false);
  };

  const renderComments = (comments: Comment[], depth = 0) => {
    if (!comments || comments.length === 0) {
      return depth === 0 ? (
        <p className="text-zinc-400 italic text-center py-4">No comments yet. Be the first to comment!</p>
      ) : null;
    }

    return (
      <div className={`space-y-4 ${depth > 0 ? 'ml-4 sm:ml-6 border-l-2 border-zinc-700 pl-4' : ''}`}>
        {comments.map((comment) => (
          <div key={comment._id} className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700 transition-all duration-200">
            <div className="flex items-center justify-between">
              <p className="text-sm joining-medium text-white">
                {comment.name}
              </p>
              <p className="text-xs text-zinc-400">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
            <p className="mt-2 text-zinc-300 whitespace-pre-wrap text-sm">{comment.body}</p>
            <button
              className="text-xs text-blue-400 hover:text-blue-300 font-medium mt-2 transition-colors duration-150"
              onClick={() => {
                setReplyingTo(comment._id);
                setForm({ ...form, parentId: comment._id });
              }}
            >
              Reply
            </button>

            {replyingTo === comment._id && (
              <form onSubmit={handleSubmit} className="mt-4 space-y-3 bg-zinc-900 p-4 rounded-lg">
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <textarea
                  placeholder="Your reply"
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150"
                  rows={3}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting ? 'Posting...' : 'Post Reply'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(null);
                      setForm({ name: '', body: '', parentId: null });
                    }}
                    className="text-sm text-zinc-400 hover:text-zinc-200 font-medium transition-colors duration-150"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {comment.replies && comment.replies.length > 0 && renderComments(comment.replies, depth + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Comments</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-zinc-800 p-6 rounded-lg">
        <input
          type="text"
          placeholder="Your name"
          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          placeholder="Leave a comment..."
          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150"
          rows={4}
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white text-sm px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitting}
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {loading ? (
        <p className="text-zinc-400 text-center py-4">Loading comments...</p>
      ) : (
        renderComments(comments)
      )}
    </div>
  );
}
