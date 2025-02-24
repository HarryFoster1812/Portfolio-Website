"use client";

import {Project} from "./project.ts";
import Link from "next/link";
import {React, useState, useRef, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {motion} from "motion/react";

export const ProjectCard = ({project, index} : {project: Project, index: number}) => {

    return (
        <>
        <div className="h-screen flex items-center justify-center overflow-hidden">
            <motion.div
                initial={{x:((-1)**index)*250, opacity:0}}
                whileInView={{x:0, opacity:1}}
                transition={{ease:"easeIn", duration:0.55}}
                className="card w-7/10 md:w-4/6 bg-blackrounded-2xl border-solid border-white border rounded-2xl overflow-hidden shadow-2xl transform-style-preserve-3d perspective-[1000px]  ease-in-out hover:translate-y-[-10px] hover:rotate-x-5 hover:rotate-y-[-5px] hover:shadow-[0_15px_40px_rgba(0,_255,_255,_0.5)] animate__animated z-1"
            >
                <img src="https://picsum.photos/500/200" alt="Project Cover" className="w-full h-[200px] object-cover transition-all ease-in-out duration-500 hover:scale-[1.1] hover:brightness-[1.2] hover:contrast-[1.2]" />
                <div className="p-6">
                    <h2 className="font-['Orbitron', sans-serif] text-3xl font-bold mb-4 text-cyan-300 text-shadow-lg animate__animated animate__fadeInDown">{`${project.name}`}</h2>
                    <p className="text-lg text-gray-300 mb-5 leading-6 animate__animated animate__fadeIn">{`${project.description}`}</p>
                    <div className="flex gap-3 mb-6 animate__animated ">
                        
                        <span className="flex items-center gap-2 px-3 py-2 bg-gray-500 rounded-full text-white text-sm transition-all duration-300 ease-in-out hover:translate-y-[-3px] hover:shadow-[0_5px_15px_rgba(0,_255,_255,_0.3)]">
                            <i className="fab fa-css3-alt text-[#264DE4]"></i> CSS
                        </span>
                        <span className="flex items-center gap-2 px-3 py-2 bg-gray-500 rounded-full text-white text-sm transition-all duration-300 ease-in-out hover:translate-y-[-3px] hover:shadow-[0_5px_15px_rgba(0,_255,_255,_0.3)]">
                            <i className="fab fa-js text-[#F0DB4F]"></i> JavaScript
                        </span>
                    </div>
                    <div className="flex justify-evenly items-center">
                        <Link href={`https://github.com/HarryFoster1812/${project.link}`} target="_blank" rel="noopener noreferrer" className="py-2 px-3 bg-gradient-to-br from-cyan-400 to-pink-500 text-black no-underline rounded-xl font-bold uppercase tracking-wide flex items-center justify-center transition-all duration-300 ease-in-out hover:translate-y-[-3px] hover:shadow-[0_10px_20px_rgba(0,_255,_255,_0.4)]">
                            <FontAwesomeIcon icon={faGithub} width={50} height={50} /> <p className="text-black no-underline font-bold uppercase text-base">View on GitHub</p>

                        </Link>
                        <Link href={`/projects/${project.link}`} className="inline-block py-2 px-3 bg-gradient-to-br from-cyan-400 to-pink-500 text-black no-underline rounded-xl font-bold uppercase tracking-wide transition-all duration-300 ease-in-out hover:translate-y-[-3px] hover:shadow-[0_10px_20px_rgba(0,_255,_255,_0.4)]">
                             See more
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
            </>
    );
}
