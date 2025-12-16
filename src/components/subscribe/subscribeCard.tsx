'use client'

import { motion } from 'framer-motion';
import React, { useState } from 'react';

// API response type
interface ApiResponse {
  message: string;
}

export const SubscribeCard: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async () => {
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Subscription failed');
      }

      setStatus('success');
      setMessage(data.message);
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage((error as Error).message || 'An error occurred');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, boxShadow: '0 15px 40px rgba(0, 171, 228, 0.35)' }}
      className="bg-zinc-900 border border-zinc-700 p-8 md:p-12 rounded-2xl flex flex-col items-center gap-6 max-w-md w-full mx-4"
    >
      <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-100 text-center">
        Never Miss a Post
      </h2>
      <p className="text-zinc-400 text-center text-sm md:text-base">
        Subscribe to get the latest deep dives directly to your inbox.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 rounded-lg bg-zinc-800 text-zinc-100 placeholder-zinc-400 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
        placeholder="you@example.com"
        disabled={status === 'loading'}
      />
      <motion.button
        onClick={handleSubmit}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full py-3 bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-500 text-zinc-900 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </motion.button>
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center text-sm mt-2 ${
            status === 'success' ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SubscribeCard;
