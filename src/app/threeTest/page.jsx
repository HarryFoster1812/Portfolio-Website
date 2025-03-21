"use client";

import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls, ScrollControls, Html, Environment, Scroll } from "@react-three/drei";
// import { Mesh } from "three";

// import { useGLTF, useAnimations } from '@react-three/drei'
import React, { useRef, useEffect } from "react";

import { getProject, val } from "@theatre/core";
// import studio from "@theatre/studio";
// @ts-expect-error it just says i have to because there are no types in r3f it just says i have to because there are no types in r3f
import { SheetProvider, editable as e, PerspectiveCamera, useCurrentSheet } from "@theatre/r3f";
// import extension from '@theatre/r3f/dist/extension'
import {useScroll, useTransform} from "motion/react";

import Model from "./model";
import {default as json} from "./THREE js x Theatre js.theatre-project-state.json";

// Initialize Theatre.js project
//studio.initialize();
//studio.extend(extension);
const project = getProject("THREE.js x Theatre.js", {state: json});
const sheet = project.sheet("Animated scene");

export const Laptop = ()=>{
    const sectionRef = useRef(null);
    
    return (
        <>
            <div className="w-screen h-[200vh]"/>
            <div ref={sectionRef} className="">
                <div style={{position: "sticky", top: 0, height:"100vh", width:"100%"}}>
                    <Canvas resize={{scroll: true}} >
                        <SheetProvider sheet={sheet}>
                            <Scene sectionRef={sectionRef}/>
                        </SheetProvider>
                    </Canvas>
                </div>
                <div className="w-screen h-[500vh]">
                </div>
            </div>
        </>
    );
}

function Scene(sectionRef) {
    useCurrentSheet();
    const {scrollYProgress} = useScroll({
        target: sectionRef
    });

    const width = useTransform(scrollYProgress, [0, 0.75], [0, 1]);

    useFrame(() => {
        // Assuming `sheet.sequence.pointer.length` is a valid number
        const AnimationLength = val(sheet.sequence.pointer.length);
        if (AnimationLength && width) {
            // Set the sheet sequence position based on the transformed scroll value
            sheet.sequence.position = width.get() * AnimationLength;
        }

        // Log the scroll progress
        console.log(scrollYProgress.get());
    });
    return (
        <>
            <PerspectiveCamera theatreKey="Camera" makeDefault position={[0, 0, 5]} zoom={0.1} />
            <ambientLight />
            <e.directionalLight theatreKey="Light" position={[0, 10, 4]} intensity={5} />
            <Model />
        </>
    );
}

