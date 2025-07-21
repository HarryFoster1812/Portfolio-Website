'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const verify = async () => {
      setStatus('loading');
      try {
        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ auth_token: id }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Verification successful!');
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed.');
        }
      } catch {
        setStatus('error');
        setMessage('Something went wrong. Please try again later.');
      }
    };

    verify();
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>

        {status === 'idle' && <p className="text-gray-600">Waiting to verify...</p>}

        {status === 'loading' && (
          <div className="flex flex-col items-center text-blue-600 font-medium">
            <svg
              className="animate-spin h-6 w-6 mb-2 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            Verifying your token...
          </div>
        )}

        {status === 'success' && <p className="text-green-600 font-semibold">{message}</p>}
        {status === 'error' && <p className="text-red-600 font-semibold">{message}</p>}
      </div>
    </div>
  );
}
