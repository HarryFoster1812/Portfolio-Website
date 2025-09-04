"use client";

import { useState, useEffect } from "react";

export default function TerminalRibbon() {
  const [show, setShow] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [userDismissed, setUserDismissed] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("terminalRibbonDismissed");
    if (dismissed === "true") {
      setUserDismissed(true);
      setShow(false);
    }
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll + 10 && show) {
        // scrolling down, collapse
        setHidden(true);
        setTimeout(() => setShow(false), 300);
      } else if (currentScroll < lastScroll - 10 && !show && !userDismissed) {
        // scrolling up, reopen
        setShow(true);
        setHidden(false);
      }
      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll, show, userDismissed]);

  const handleClose = (e: React.MouseEvent) => {
    setUserDismissed(true);
    sessionStorage.setItem("terminalRibbonDismissed", "true");
    e.stopPropagation();
    setHidden(true);
    setTimeout(() => setShow(false), 300);
  };

  const handleOpen = () => {
    setShow(true);
    setHidden(false);
    setUserDismissed(false);
    sessionStorage.removeItem("terminalRibbonDismissed");
  };

  if (show) {
    return (
      <div
        className={`fixed right-0 top-1/4 transform -translate-y-1/2 bg-none text-green-400 px-5 py-3 rounded-l-lg shadow-lg flex items-center space-x-3
                    ${hidden ? "animate-slide-out" : "animate-slide-in"} transition-all`}
        style={{ zIndex: 1000 }}
      >
        {/* Only this badge is clickable */}
        <a
          href="/terminal"
          className="bg-green-900 text-green-100 px-2 py-1 rounded hover:bg-green-700 font-mono font-semibold"
        >
        <span className="font-medium">Try the interactive terminal!</span>
        </a>

        {/* Ribbon text */}

        {/* Close button */}
        <button
          onClick={handleClose}
          className="ml-auto text-green-400 hover:text-green-200 font-bold font-mono"
        >
          ✕
        </button>
      </div>
    );
  }

  // Small arrow when closed
  return (
    <button
      onClick={handleOpen}
      className="fixed right-0 top-1/4 transform -translate-y-1/4 bg-black text-green-400 px-2 py-3 rounded-l-lg shadow-lg hover:bg-gray-900 font-mono transition-colors"
      style={{ zIndex: 1000 }}
    >
      ➤
    </button>
  );
}
