"use client";

import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls, ScrollControls, Html, Environment, Scroll } from "@react-three/drei";
// import { Mesh } from "three";

// import { useGLTF, useAnimations } from '@react-three/drei'
import React, { useRef, useEffect, useState } from "react";

import { getProject, val } from "@theatre/core";
// @ts-expect-error it just says i have to because there are no types in r3f it just says i have to because there are no types in r3f
import { SheetProvider, editable as e, PerspectiveCamera, useCurrentSheet } from "@theatre/r3f";
import {useScroll, useTransform} from "motion/react";

import Model from "./model";
import {default as json} from "./THREE js x Theatre js.theatre-project-state.json";


// Initialize Theatre.js project

// import studio from "@theatre/studio";
// import extension from '@theatre/r3f/dist/extension'
// studio.initialize();
// studio.extend(extension);

const project = getProject("THREE.js x Theatre.js", {state: json});
const sheet = project.sheet("Animated scene");

export const Laptop = ()=>{
    const modelAnimationSection = useRef(null);
    const screenSection = useRef(null);
    const transitionSection = useRef(null);
    
    return (
        <>
            <div id="sectionRef" className="">
                <div style={{position: "sticky", top: 0, height:"100vh", width:"100%"}}>
                    <Canvas resize={{scroll: true, auto: true}} >
                        <SheetProvider sheet={sheet}>
                            <Scene  modelSection={modelAnimationSection} ref={{screenSection,transitionSection}}/>
                        </SheetProvider>
                    </Canvas>
                </div>
                <div ref={modelAnimationSection} id="afterSection" className="w-screen h-[500vh]">
                </div>
                <div ref={screenSection} className="w-screen h-[300vh]">
                </div>
                <div ref={transitionSection} className="w-screen h-[400vh]">
                </div>
            </div>
        </>
    );
}

const Scene = React.forwardRef(({modelSection}, {screenSection, transitionSection})=> {
    useCurrentSheet();

    // Set up scroll tracking with the offset to make it stop when the bottom of the section hits the bottom of the viewport
    const { scrollYProgress: animationProgress } = useScroll({
        target: modelSection,
        offset: ["start end", "end end"] // Adjusted offset to stop when the section's bottom hits the viewport's bottom
    });


    useFrame(() => {
        const AnimationLength = val(sheet.sequence.pointer.length);
        sheet.sequence.position = animationProgress.get() * AnimationLength;
    });

    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

    useEffect(() => {
        const onResize = () => {
            setSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <>
            <PerspectiveCamera theatreKey="Camera" makeDefault position={[0, 0, 5]} zoom={0.1} aspect={size[0] / size[1]} />
            <ambientLight />
            <e.directionalLight theatreKey="Light" position={[0, 10, 4]} intensity={5} />
            <Model width={size[0]} ref={{screenSection, transitionSection}} />
        </>
    );
});

