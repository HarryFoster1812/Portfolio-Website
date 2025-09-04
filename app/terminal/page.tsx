"use client"

import { useState, useRef, useEffect } from "react";
import { TerminalSession, HistoryEntry } from "@/lib/terminal_session";
import { DirNode } from "@/lib/filesystem_types";

const rootFS: DirNode = {
  type: "dir",
  children: {
    blog: {
      type: "dir",
      children: {
        "welcome.txt": {
          type: "file",
          content: "Welcome to my blog! Here's the first post...",
        },
        "tensors-and-machine-learning.md": {
          type: "lazyFile",
          fetchContent: async () =>
            await fetch("/api/blog/tensors-and-machine-learning").then((res) => res.text()),
        },
      },
    },
    "about.txt": {
      type: "file",
      content: "Hi, I’m Harry Foster. I build cool stuff.",
    },
  },
};

const session = new TerminalSession(rootFS);

export default function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const prompt = "user@harryfoster.tech";
  const terminalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    session.execute(input);
    setHistory(session.getHistory());
    setInput("");
  };

    return (
        <div
            ref={terminalRef}
            className="flex-1 w-full max-w-8xl mx-auto p-8 space-y-4 rounded-lg shadow-lg bg-black text-green-400 font-mono overflow-y-auto"
        >
            {history.map((entry, i) => (
                <div key={i}>
                    <span>{prompt}:{entry.dir.join("/")} $ </span>{entry.command}
                    {entry.response && <div>{entry.response}</div>}
                </div>
            ))}
            <form onSubmit={handleCommand} className="mt-2 flex items-center">
                <span>{prompt}:{session.getCurrentPath().join("/")} $ </span>
                <input
                    autoFocus
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-black text-green-400 outline-none flex-1 ml-2"
                />
            </form>
        </div>
    );
}
