"use client";
import TypewriterEffect from "./typewriter";
import {motion} from "motion/react";

export const Welcome = () => {
    return (
        <>
            <section className="h-screen flex items-center justify-center z-1 -mt-[68px]">
                <motion.div
                    initial={{y:-100,  opacity:0}}
                    animate={{y:0, opacity:1}}
                    transition={{ type: 'ease', duration: 0.5 }}

                    className="text-center p-6 md:p-12 max-w-3xl w-full"
                >
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-stone-300 mb-2">
                        Hi, my name is
                    </h2>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                        Harry Foster
                    </h1>
                    <p className="text-lg sm:text-xl font-medium text-stone-300">
                        {"I\'m a"} <TypewriterEffect />
                    </p>
                </motion.div>
            </section>
        </>
    );
};
