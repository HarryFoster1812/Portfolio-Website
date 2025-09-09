"use client"

import { useState, useRef, useEffect } from "react";
import { TerminalSession, HistoryEntry } from "@/lib/terminal_session";
import { DirNode } from "@/lib/filesystem_types";


export default function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const prompt = "user@harryfoster.tech";
  const terminalRef = useRef<HTMLDivElement | null>(null);
    const [session, setSession] = useState<TerminalSession | null>(null);

useEffect(() => {
    const fetchFS = async () => {
        try {
            const res = await fetch("api/terminal_filesystem");
            if (!res.ok) {
                throw new Error("Failed to fetch repos");
            }
            const rootFS: DirNode = await res.json();
            setSession(new TerminalSession(rootFS));
        } catch (error) {
            console.error("Error fetching filesystem:", error);
        }
    };

    fetchFS();
}, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    await session!.execute(input);
    setHistory(session!.getHistory());
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
                <span>{prompt}:{session?.getCurrentPath().join("/")} $ </span>
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
