"use client";

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useEffect, useRef } from "react";
import { getProject } from '@theatre/core';
import studio from '@theatre/studio';
import {default as extension} from '@theatre/r3f/dist/extension'
import { SheetProvider } from '@theatre/r3f'
// Initialize the studio and create a Theatre.js project
studio.initialize();
studio.extend(extension);
const project = getProject('THREE.js x Theatre.js');

// Create the sheet for your animation (this defines the properties to animate)
const sheet = project.sheet('Animated scene');

export default function Test() {
    const refContainer = useRef(null);

    useEffect(() => {
        // === THREE.JS CODE START ===
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        refContainer.current && refContainer.current.appendChild(renderer.domElement);

        // Add an ambient light to the scene
        const light = new THREE.AmbientLight(0xffffff, 1); // White light
        scene.add(light);

        // Add a directional light to illuminate the model
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5).normalize();  // Position the light
        scene.add(directionalLight);

        // Set the camera position to ensure the model is visible

        const gltfLoader = new GLTFLoader();
        let model; // The loaded model

        // Load the .glb model
        gltfLoader.load('/models/Laptop.glb', (gltf) => {
            model = gltf.scene;
            
            // Set position and scale of the model
            model.position.set(0, 0, 0);  // Place model in the center
            model.scale.set(1, 1, 1);     // Set a reasonable scale for the model
            console.log(model); 
            // Add the model to the scene
            scene.add(model);

            const cylinder = model.getObjectByName("Cylinder"); 
            const cylinderObj = sheet.object('Model/cylinder', {
                positionX: cylinder.position.x,
                positionY: cylinder.position.y,
                positionZ: cylinder.position.z,

                rotationX: cylinder.rotation.x,
                rotationY: cylinder.rotation.y,
                rotationZ: cylinder.rotation.z,
            });

            // Link Theatre.js properties to Three.js model properties
            cylinderObj.onValuesChange((values) => {
                cylinder.position.set(values.positionX, values.positionY, values.positionZ);
                cylinder.rotation.set(values.rotationX, values.rotationY, values.rotationZ);
            });

            // === Integrating Theatre.js ===
            // Create a Theatre.js object that references the model's properties (position, rotation, scale, etc.)
            const modelObj = sheet.object('Model', {
                positionX: 0,
                positionY: 0,
                positionZ: 0,
                rotationY: 0,
                rotationX: 0,
                rotationZ: 0,
                scaleX: 1,
                scaleY: 1,
                scaleZ: 1,
            });

            // Link Theatre.js properties to Three.js model properties
            modelObj.onValuesChange((values) => {
                model.position.set(values.positionX, values.positionY, values.positionZ);
                model.rotation.y = values.rotationY;
                model.rotation.x = values.rotationX;
                model.rotation.z = values.rotationZ;
                model.scale.set(values.scaleX, values.scaleY, values.scaleZ);
            });

            const cameraObj = sheet.object('Camera', {
                positionX: 0,
                positionY: 0,
                positionZ: 5,
                zoom: 1,
                fov: 50,
            });
            cameraObj.onValuesChange((values) => {
                camera.position.set(values.positionX, values.positionY, values.positionZ);
                camera.zoom = values.zoom;
                camera.fov = values.fov;
                camera.updateProjectionMatrix();
            });

            //recursiveChildAdd(model, sheet); 
            // Animation loop for Three.js
            function animate() {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }

            function recursiveChildAdd(model, sheet){
                model.children.forEach( (child) => {
                    let childObj = sheet.object(child.name, {
                        positionX: child.position.x,
                        positionY: child.position.x,
                        positionZ: child.position.x,
                        scaleX: child.scale.x,
                        scaleY: child.scale.y,
                        scaleZ: child.scale.z,
                    });

                    // Link Theatre.js properties to Three.js model properties
                    childObj.onValuesChange((values) => {
                        child.position.set(values.positionX, values.positionY, values.positionZ);
                        child.rotation.y = values.rotationY;
                        child.rotation.x = values.rotationX;
                        child.rotation.z = values.rotationZ;
                        child.scale.set(values.scaleX, values.scaleY, values.scaleZ);
                    });

                    if(child.children.length > 0){
                        recursiveChildAdd(child, sheet);
                    }

                });
            }

            // Start the animation loop
            animate();
        }, undefined, (error) => {
                console.error(error);
            });

        // Handle window resizing
        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onWindowResize, false);

        // Cleanup on component unmount
        return () => {
            if (renderer.domElement && refContainer.current) {
                refContainer.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <SheetProvider sheet={sheet}>
            <div ref={refContainer} />
        </SheetProvider>
    );
}
