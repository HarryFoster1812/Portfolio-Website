"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from 'next/link'
import Vercel from "./vercel"
import Github from  "./github"
import LinkedIn from "./linkedin"

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track menu visibility
    const currentRoute = usePathname(); // This gets the current route path

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Toggle the menu visibility
    };

    return (
        <>
        <nav className="bg-zinc-800 border-zinc-700 dark:bg-zinc-900 fixed top-0 left-0 w-full sticky z-10">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Vercel />
                    {/*Image src="../../../public/vercel.svg" width={30} height={30} alt="Site Logo" className="h-8"/>*/}
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Harry Foster</span>
                </Link>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <button
                        type="button"
                        className="text-white bg-zinc-700 hover:bg-zinc-600 focus:ring-4 focus:outline-none focus:ring-zinc-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-zinc-600 dark:hover:bg-zinc-500 dark:focus:ring-zinc-400"
                    >
                            <Link href="/Harry_Foster_CV.pdf" download>Resume</Link>
                    </button>
                    {/* Toggle Button for Mobile Menu */}
                    <button
                        type="button"
                        onClick={toggleMenu} // Handle the click to toggle the menu
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-zinc-400 rounded-lg md:hidden hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:text-zinc-500 dark:hover:bg-zinc-700 dark:focus:ring-zinc-600"
                        aria-controls="navbar-cta"
                        aria-expanded={isMenuOpen ? "true" : "false"}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                {/* Mobile Menu */}
                <div
                    className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? "block" : "hidden"}`} // Conditionally render based on `isMenuOpen`
                    id="navbar-cta"
                >
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-zinc-700 rounded-lg bg-zinc-800 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-zinc-800 dark:bg-zinc-900 md:dark:bg-zinc-900 dark:border-zinc-800">
                        <li>
                            <Link href="/" className={`block py-2 px-3 md:p-0 ${currentRoute === "/" ? "text-blue-500 md:dark:text-blue-400" : "text-white md:dark:text-white"} hover:bg-zinc-700 md:hover:bg-transparent rounded-sm md:bg-transparent `}>Home</Link>
                        </li>
                        <li>
                            <Link href="/projects" className={`block py-2 px-3 md:p-0 ${currentRoute === "/projects" ? "text-blue-500 md:dark:text-blue-400" : "text-white"} hover:bg-zinc-700 md:hover:bg-transparent md:hover:text-blue-500 md:dark:hover:text-blue-400`}>Projects</Link>
                        </li>
                        <li>
                            <Link href="/blog" className={`block py-2 px-3 md:p-0 ${currentRoute.includes("/blog") ? "text-blue-500 md:dark:text-blue-400" : "text-white"} hover:bg-zinc-700 md:hover:bg-transparent md:hover:text-blue-500 md:dark:hover:text-blue-400`}>Blog</Link>
                        </li>
                        <li>
                            <Link href="https://github.com/harryfoster1812" target="_blank" rel="noopener noreferrer" className="block py-2 px-3 md:p-0 hover:bg-zinc-900 "><Github className="hover:fill-[#0A66C2]" /></Link>
                        </li>
                        <li>
                            <Link href="https://www.linkedin.com/in/harry-w-foster" target="_blank" rel="noopener noreferrer" className="block py-2 px-3 md:p-0 hover:bg-zinc-900"><LinkedIn className="hover:fill-[#0A66C2]" /></Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        </>
    );
};
