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
        className="inline-block py-2 px-3 bg-gradient-to-br from-cyan-400 to-pink-500 text-black no-underline rounded-xl font-bold uppercase tracking-wide transition-all duration-300 ease-in-out hover:translate-y-[-3px] hover:shadow-[0_10px_20px_rgba(0,_255,_255,_0.4)]"
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
