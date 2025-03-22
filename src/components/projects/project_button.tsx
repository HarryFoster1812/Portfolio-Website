"use client";

import Link from "next/link";
import {motion} from "motion/react";

export const ProjectButton = () => {
    return (
        <motion.div 
            initial={{opacity:0, scale:0}}
            whileInView={{opacity:1, scale:1}}
            transition={{ease:"easeIn", duration:0.55}}
            viewport={{ once: true }} // Ensures animation runs only once
            className="w-full flex items-center justify-center m-10">
            <Link 
                href="/projects" 
                className="inline-block py-3 px-6 bg-gradient-to-br from-cyan-400 to-pink-500 text-black no-underline rounded-xl font-bold uppercase tracking-wide transition-all duration-300 ease-in-out hover:translate-y-[-3px] hover:shadow-[0_10px_20px_rgba(0,_255,_255,_0.4)]"
            >
                Check out my other projects
            </Link>
        </motion.div>
    );
}
