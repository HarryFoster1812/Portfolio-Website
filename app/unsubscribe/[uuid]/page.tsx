'use client';
import { useState, useRef, useEffect } from 'react';


export default function UnsubscribePage({
    params,
}: {
        params: Promise<{ uuid: string }>;
    }) {
    const stages = [
        "Unsubscribe",
        "Are you sure?",
        "Wait, really?",
        "Think it over...",
        "You can't be serious!",
        "I'll miss you 😢",
        "Please, reconsider!",
        "Don't go yet!",
        "You don't want to do this 💔",
        "This is your last chance.",
    ];

    const containerRef = useRef(null);
    const [stage, setStage] = useState(0);
    const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
    const [lastClick, setLastClick] = useState(false);
    const [transitionStage, setTransitionStage] = useState<"none" | "fadeOut" | "goodbye" | "ok" | "end">("none");

    const nextStage = () => {
        if (stage < stages.length - 1) {
            setStage(stage + 1);

            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const buttonWidth = 200;
            const buttonHeight = 60;

            const maxX = rect.width / 2 - buttonWidth / 2;
            const maxY = rect.height / 2 - buttonHeight / 2;

            const x = Math.random() * (maxX * 2) - maxX;
            const y = Math.random() * (maxY * 2) - maxY;

            setButtonOffset({ x, y });
        } else {
            // Begin final transition sequence
            setTransitionStage("fadeOut");

            (async () => {
                try {
                    const resolvedParams = await params; // resolve the promise
                    const { uuid } = resolvedParams;
                    const response = await fetch('/api/unsubscribe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ auth_token: uuid }),
                    });

                    if (!res.ok) {
                        console.error("Unsubscribe failed");
                    }
                } catch (err) {
                    console.error(err);
                }
            })();
        }
    };

    // Handle final transition sequence
    useEffect(() => {
        if (transitionStage === "fadeOut") {
            const timeout1 = setTimeout(() => setTransitionStage("ok"), 500); // fade out previous
            return () => clearTimeout(timeout1);
        }
        if (transitionStage === "ok") {
            const timeout2 = setTimeout(() => setTransitionStage("goodbye"), 2000); // show goodbye then OK
            return () => clearTimeout(timeout2);
        }
        if (transitionStage === "goodbye") {
            const timeout2 = setTimeout(() => setTransitionStage("end"), 1000); // show goodbye then OK
            return () => clearTimeout(timeout2);
        }
    }, [transitionStage]);

    const desperationPercent = (stage / (stages.length - 1)) * 100;

    return (
        <div
            ref={containerRef}
            className="flex-1 flex flex-col items-center justify-center w-full p-8"
        >
            <audio id="audio" loop autoPlay>
                <source src="/sad_music.mp3" type="audio/mpeg" />
            </audio>

            {/* Main interactive stages */}
            {!lastClick && transitionStage === "none" && (
                <div className="flex flex-col items-center space-y-8 transition-all duration-500 ease-in-out">
                    {/* Desperation Meter */}
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold mb-2">Desperation:</h3>
                        <div className="w-64 bg-gray-700 rounded-full h-2">
                            <div
                                className="h-2 bg-red-500 rounded-full transition-all duration-300"
                                style={{ width: `${desperationPercent}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Moving Button */}
                    <div
                        className="transition-transform duration-300"
                        style={{ transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)` }}
                    >
                        <button
                            onClick={nextStage}
                            className="bg-gray-700 text-white px-10 py-5 text-xl rounded-2xl border border-gray-600 hover:bg-gray-600 transition-colors duration-300 font-semibold focus:outline-none focus:ring-4 focus:ring-red-500"
                        >
                            {stages[stage]}
                        </button>
                    </div>

                    {/* Stay Link */}
                    <div>
                        <a
                            href="/"
                            className="text-green-400 text-lg hover:text-green-500 transition-colors"
                        >
                            Nah, I'll stick around
                        </a>
                    </div>
                </div>
            )}

            {/* Goodbye message transition */}
            {transitionStage === "ok" && (
                <div className="transition-opacity duration-2000 ease-in">
                    <p className="text-8xl font-bold">OK</p>
                </div>
            )}

            {/* OK confirmation */}
            {transitionStage === "goodbye" && (
                <div className="transition-opacity duration-1000 ease-in">
                    <p className="text-8xl font-bold">Goodbye.</p>
                </div>
            )}
        </div>
    );
}
