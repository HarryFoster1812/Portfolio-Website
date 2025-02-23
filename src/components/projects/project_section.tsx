import {Project} from "./project.ts";
import {ProjectCard} from "./project_card";
import Link from "next/link";



export const ProjectSection = () => {
    let projects: Project[] = [
        {
            name: "AttendEase",
            description: "A university project built with Bootstrap, JavaScript, and PHP. This app features a dynamic calendar, location-based attendance verification, rolling code backups, and interactive statistics and leaderboards for both staff and students.",
            tags: ["HTML", "JS", "PHP", "Bootstrap", "CSS"],
            image: "",
            link: "AttendEase"
        },


        {
            name: "Scroll Tracker",
            description: "A personal project built in Java using Android Studio. This app tracks user scrolling events via the Android Accessibility Service, collecting data on scroll speed, direction, and frequency. It then visualizes this data with interactive graphs, allowing users to analyze and compare their scrolling behavior over time. Key features include real-time tracking, customizable alerts, and data visualizations.",
            tags: ["Java", "Android"],
            image: "",
            link: "ScrollTracker"
        },

        {
            name: "Chess AI",
            description: "A C#-based chess engine built for single-player and two-player modes, utilizing the Minimax algorithm for optimal move calculation. The engine features a WPF UI for a smooth user experience and supports the Universal Chess Interface (UCI), allowing the import of other engines and export of the built engine.",
            tags: ["C#", "Minimax"],
            image: "",
            link: "NEA-Chess-AI-Project"
        },
    ]
    return (
        <>
            <section className="min-h-screen max-h-auto flex items-center flex-col justify-center space-y-4">
                <h1 className="w-full text-center p-10">Projects</h1>
                {
                    projects.map((project, index) => (
                        <ProjectCard key={index} project={project}/> // Pass project prop
                    ))
                }
                <div className="w-full flex items-center justify-center m-10">
                    <Link href="/projects" className="inline-block py-3 px-6 bg-gradient-to-br from-cyan-400 to-pink-500 text-black no-underline rounded-xl font-bold uppercase tracking-wide relative transition-all duration-300 ease-in-out hover:translate-y-[-3px] hover:shadow-[0_10px_20px_rgba(0,_255,_255,_0.4)]" >Check out my other projects</Link>
                </div>
            </section>
        </>
    );
}
