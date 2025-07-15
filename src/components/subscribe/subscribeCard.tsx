'use client'

import { motion } from 'framer-motion';
import React, { useState } from 'react';


// Define API response type
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0, 171, 228, 0.5)' }}
      className="bg-[#1A1A1A] border border-gray-700 p-6 rounded-xl flex flex-col items-center gap-6"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
        Subscribe to Never Miss a Post!
      </h1>
      <input
        type="email"
        id="emailInput"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-3/4 md:w-2/3 p-3 rounded-lg bg-gray-800 text-white text-center border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00ABE4] transition-colors duration-200"
        placeholder="example@example.com"
        disabled={status === 'loading'}
      />
      <motion.button
        type="button"
        onClick={handleSubmit}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-2/3 md:w-1/3 p-3 rounded-lg text-white text-center bg-gradient-to-br from-[#00ABE4] to-[#ff4d4f] hover:bg-gradient-to-bl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00ABE4] disabled:opacity-50"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Subscribing...' : 'Join!'}
      </motion.button>
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center text-sm ${
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
