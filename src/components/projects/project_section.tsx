"use client";

import {Project} from "./project";
import {ProjectCard} from "./project_card";
import {ProjectButton} from "./project_button"

export const ProjectSection = () => {
    const projects: Project[] = [
        {
            name: "AttendEase",
            description: "A university project built with Bootstrap, JavaScript, and PHP. This app features a dynamic calendar, location-based attendance verification, rolling code backups, and interactive statistics and leaderboards for both staff and students.",
            tags: ["HTML", "JS", "PHP", "Bootstrap", "CSS"],
            image: "/attendease.jpg",
            link: "AttendEase"
        },


        {
            name: "Scroll Tracker",
            description: "A personal project built in Java using Android Studio. This app tracks user scrolling events via the Android Accessibility Service, collecting data on scroll speed, direction, and frequency. It then visualizes this data with interactive graphs, allowing users to analyze and compare their scrolling behavior over time. Key features include real-time tracking, customizable alerts, and data visualizations.",
            tags: ["Java", "Android"],
            image: "/scrolling.avif",
            link: "ScrollTracker"
        },

        {
            name: "Chess AI",
            description: "A C#-based chess engine built for single-player and two-player modes, utilizing the Minimax algorithm for optimal move calculation. The engine features a WPF UI for a smooth user experience and supports the Universal Chess Interface (UCI), allowing the import of other engines and export of the built engine.",
            tags: ["C#", "Minimax"],
            image: "/chess.jpg",
            link: "NEA-Chess-AI-Project"
        },
    ]
    return (
        <>
            <section className="min-h-screen max-h-auto flex items-center flex-col justify-center gap-5 z-10">
                <h1 className="w-full text-center p-10 font-bold text-white mt-6">Projects</h1>
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
