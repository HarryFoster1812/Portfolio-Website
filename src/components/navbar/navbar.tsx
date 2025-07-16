"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Github from "./github";
import LinkedIn from "./linkedin";

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const currentRoute = usePathname();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/projects", label: "Projects" },
        { href: "/blog", label: "Blog" },
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <nav className="bg-zinc-800 border-zinc-700 dark:bg-zinc-900 fixed top-0 left-0 w-full sticky z-50">
                <div className="max-w-screen-xl mx-auto py-4 px-4 grid grid-cols-6 md:grid-cols-12 items-center gap-4">
                    {/* Left section: Source Code + Site Name */}
                    <div className="flex items-center gap-4 col-span-3">

                        <Link
                            href="https://github.com/HarryFoster1812/Portfolio-Website"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center"
                        >
                            <button
                                type="button"
                                className="text-white border border-zinc-500 hover:bg-zinc-700 focus:ring-4 focus:outline-none focus:ring-zinc-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:border-zinc-400 dark:hover:bg-zinc-700 dark:focus:ring-zinc-600"
                                title="View source code"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 fill-white"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8.7 16.3L4.4 12l4.3-4.3-1.4-1.4L1.6 12l5.7 5.7 1.4-1.4zm6.6 0l4.3-4.3-4.3-4.3 1.4-1.4L22.4 12l-5.7 5.7-1.4-1.4z" />
                                </svg>

                            </button>
                        </Link>
                        <Link href="/" className="flex items-center rtl:space-x-reverse">
                            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                                Harry Foster
                            </span>
                        </Link>
                    </div>

                    {/* Center section: Nav links + GitHub + LinkedIn */}
                    <div className="hidden md:flex col-span-6 justify-center items-center">
                        <ul className="flex space-x-6 font-medium">
                            {navLinks.map(({ href, label }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className={`block py-2 px-3 md:p-0 ${
currentRoute === href 
? "text-blue-500 md:dark:text-blue-400"
: "text-white md:dark:text-white"
} hover:bg-zinc-700 md:hover:bg-transparent md:hover:text-blue-500 md:dark:hover:text-blue-400 rounded-sm`}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    href="https://github.com/harryfoster1812"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:fill-[#0A66C2]"
                                    aria-label="GitHub Profile"
                                >
                                    <Github />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="https://www.linkedin.com/in/harry-w-foster"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:fill-[#0A66C2]"
                                    aria-label="LinkedIn Profile"
                                >
                                    <LinkedIn />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Right section: Resume + Mobile menu toggle */}
                    <div className="col-span-3 md:col-span-3 grid md:flex md:w-">
                        <div className="flex justify-end gap-2 w-full">
                            <Link href="/Harry_Foster_CV.pdf" download>
                                <button
                                    type="button"
                                    className="text-white bg-zinc-700 hover:bg-zinc-600 focus:ring-4 focus:outline-none focus:ring-zinc-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-zinc-600 dark:hover:bg-zinc-500 dark:focus:ring-zinc-400"
                                >
                                    Resume
                                </button>
                            </Link>

                            {/* Mobile Menu Toggle Button */}
                            <button
                                type="button"
                                onClick={toggleMenu}
                                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-zinc-400 rounded-lg md:hidden hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:text-zinc-500 dark:hover:bg-zinc-700 dark:focus:ring-zinc-600"
                                aria-controls="navbar-cta"
                                aria-expanded={isMenuOpen ? "true" : "false"}
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 17 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M1 1h15M1 7h15M1 13h15"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div
                        className={`items-center justify-between w-full md:hidden col-span-6 mt-4 ${
isMenuOpen ? "block" : "hidden"
}`}
                        id="navbar-cta"
                    >
                        <ul className="flex flex-col font-medium p-4 border border-zinc-700 rounded-lg bg-zinc-800 dark:bg-zinc-900 dark:border-zinc-800 space-y-3">
                            {navLinks.map(({ href, label }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`block py-2 px-3 ${
currentRoute === href 
? "text-blue-500 md:dark:text-blue-400"
: "text-white md:dark:text-white"
} hover:bg-zinc-700 rounded-sm`}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    href="https://github.com/harryfoster1812"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 py-2 px-3 hover:bg-zinc-700 rounded-sm"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Github />
                                    GitHub
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="https://www.linkedin.com/in/harry-w-foster"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 py-2 px-3 hover:bg-zinc-700 rounded-sm"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LinkedIn />
                                    LinkedIn
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};
