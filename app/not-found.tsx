'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for the pathname
  useEffect(() => setMounted(true), []);

  const repoUrl = "https://github.com/HarryFoster1812/Portfolio-Website";
  const issueBody = encodeURIComponent(`Bug Report: User encountered a 404 error.\n\n**Path:** ${pathname}\n**Referrer:** ${typeof document !== 'undefined' ? document.referrer : 'Direct'}`);
  const githubLink = `${repoUrl}/issues/new?title=404+Error+at+${pathname}&body=${issueBody}`;

  if (!mounted) return null;

  return (
    <div 
            className="flex-1 w-full bg-[#0a0a0a] text-white flex items-center justify-center p-6 font-sans"
        >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-2xl w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Large 404 Hero Section */}
        <div className="md:col-span-3 bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-10 flex flex-col items-center text-center">
          <span className="text-xs font-mono tracking-[0.3em] uppercase opacity-50 mb-4">Error Code: 404</span>
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">
            LOST
          </h1>
          <p className="mt-4 text-lg text-white/60 max-w-sm">
            The coordinates for <span className="text-teal-400 font-mono italic">{pathname}</span> don&apos;t exist in my current build.
          </p>
        </div>

        {/* GitHub Report Card */}
        <div className="md:col-span-2 bg-teal-500/10 border border-teal-500/20 backdrop-blur-md rounded-3xl p-8 flex flex-col justify-between group hover:border-teal-500/40 transition-all">
          <div>
            <h3 className="text-xl font-bold mb-2">Help me fix this?</h3>
            <p className="text-sm text-white/60 mb-6">
              Reporting this error helps me keep this portfolio bug-free. It only takes a second to open an issue.
            </p>
          </div>
          <a 
            href={githubLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-teal-400 transition-colors w-full md:w-max"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
            Open GitHub Issue
          </a>
        </div>

        {/* Quick Return Card */}
        <Link 
          href="/" 
          className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 flex flex-col items-center justify-center hover:bg-white/10 transition-all text-center group"
        >
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          </div>
          <span className="font-bold">Take Me Home</span>
        </Link>

      </main>
    </div>
  );
}
