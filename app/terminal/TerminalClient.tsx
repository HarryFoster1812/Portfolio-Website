// app/terminal/TerminalClient.tsx
"use client"

import { useState, useRef, useEffect } from "react";
import { TerminalSession, HistoryEntry } from "@/lib/terminal_session";
import { DirNode } from "@/lib/filesystem_types";

// Define the props for the component
interface TerminalClientProps {
    rootFS: DirNode;
}

export default function TerminalClient({ rootFS }: TerminalClientProps) {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [input, setInput] = useState("");
    const prompt = "user@harryfoster.tech";
    const terminalRef = useRef<HTMLDivElement | null>(null);

    // Initialize the session with the server-fetched data
    // We use a ref to ensure the session object is stable across renders
    const sessionRef = useRef(new TerminalSession(rootFS));

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = async (e: React.FormEvent) => {
        e.preventDefault();
        const currentSession = sessionRef.current;
        await currentSession.execute(input);
        setHistory([...currentSession.getHistory()]);
        setInput("");
    };

    return (
        <div
            ref={terminalRef}
            className="flex-1 w-full max-w-8xl mx-auto p-8 space-y-4 rounded-lg shadow-lg bg-black text-green-400 font-mono overflow-y-auto"
        >
            {/* History and input form remain the same */}
            {history.map((entry, i) => (
                <div key={i}>
                    <span>{prompt}:{entry.dir.join("/")} $ </span>{entry.command}
                    {entry.response && <div>{entry.response}</div>}
                </div>
            ))}
            <form onSubmit={handleCommand} className="mt-2 flex items-center">
                <span>{prompt}:{sessionRef.current.getCurrentPath().join("/")} $ </span>
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
