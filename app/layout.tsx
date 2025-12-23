import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Navbar} from "@/components/navbar/navbar";
import { Tracker } from "@/components/tracker";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import PolyfillsClient from './polyfills_client';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
    metadataBase: new URL("https://harryfoster.tech"),
  title: {
    default: "Harry Foster - Software Engineer",
    template: "%s | Harry Foster",
  },

  description:
    "Portfolio and blog of Harry Foster, a software engineer specialising in React, Next.js, TypeScript, and modern web development.",

keywords: [
  "Harry Foster",
  "software engineer",
  "full-stack developer",
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "C",
  "C++",
  "C#",
  "Rust",
  "Assembly",
  "backend",
  "frontend",
  "systems programming",
  "portfolio",
  "technical blog",
],

  authors: [{ name: "Harry Foster" }],
  creator: "Harry Foster",

  openGraph: {
    title: "Harry Foster - Software Engineer",
    description:
      "Portfolio and blog of Harry Foster. Projects, articles, and experiments in React, Next.js, TypeScript, and modern web development.",
    siteName: "Harry Foster",
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Harry Foster - Software Engineer",
    description:
      "Portfolio and blog of Harry Foster. Projects and articles on modern web development.",
  },

  robots: {
    index: true,
    follow: true,
  },

    alternates: {
        canonical: "./",
    },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white flex flex-col min-h-screen h-full`}
      >
        <PolyfillsClient />
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Analytics />
        <SpeedInsights/>

        <Tracker />
      </body>
    </html>
  );
}
