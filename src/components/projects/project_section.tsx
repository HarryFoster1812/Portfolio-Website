"use client";

import {Project} from "./project";
import {ProjectCard} from "./project_card";
import {ProjectButton} from "./project_button"

export const ProjectSection = () => {
    const projects: Project[] = [
        // {
        //     name: "The Last Call",
        //     description: "A Flutter BAC tracker with live Widmark-based predictions, persistent sessions via SQLite, and an explore page powered by Supabase/Postgres geo queries for nearby venues.",
        //     tags: ["Flutter", "Dart", "Supabase", "Postgres", "SQLite"],
        //     image: "/project-banners/last-call.jpg",
        //     link: "The-Last-Call"
        // },

        {
            name: "WHILE Compiler",
            description: "Educational compiler for a minimal Turing-complete language: lexer, predictive parser, semantic checks, and x86 NASM codegen, plus a Gödel-style decoder tool.",
            tags: ["C", "Compilers", "Parsing", "x86", "NASM"],
            image: "/project-banners/while-compiler.jpg",
            link: "whileprogramming"
        },
        {
            name: "Cloth Simulation",
            description: "Real-time, physics-based cloth sim in modern C++/OpenGL with adjustable constraints, collision handling, fly camera, and a Dear ImGui tooling UI.",
            tags: ["C++", "OpenGL", "GLFW", "GLAD", "ImGui"],
            image: "/project-banners/cloth-sim.jpg",
            link: "Cloth-Simulation"
        },
        {
            name: "Chess Engine",
            description: "Custom C# engine with bitboards, magic move gen, Zobrist hashing, transposition tables, perft tests, opening book, and a polished WPF UI with UCI support.",
            tags: ["C#", "WPF", "UCI", "AI", "Algorithms"],
            image: "/project-banners/chess.jpg",
            link: "Chess-Engine"
        },
        {
            name: "FosterML",
            description: "A tensor library with an autograd system, built without external deps to explore low-level AI mechanics and backprop fundamentals.",
            tags: ["Python", "Autograd", "Tensors", "ML"],
            image: "/project-banners/fosterml.jpg",
            link: "FosterML"
        }
    ];
    return (
        <>
            <section className="min-h-screen max-h-auto flex items-center flex-col justify-center gap-5 z-10">
                <h2 className="w-full text-center p-10 font-bold text-white mt-6 text-5xl">Projects</h2>
                <div className="h-auto w-full flex items-center flex-col justify-center">
                {
                    projects.map((project, index) => (
                            <ProjectCard key={index} project={project} index={index}/> 
                    ))
                }
                </div>

               <ProjectButton /> 
            </section>
        </>
    );
}
