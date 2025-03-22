import { useGLTF } from '@react-three/drei'
// import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useThree } from '@react-three/fiber'
// @ts-expect-error it just says i have to because there are no types in r3f it just says i have to because there are no types in r3f
import { editable as e } from "@theatre/r3f";
import React, {useRef, useState, useMemo, useEffect} from "react";
import {ProjectSection} from "../../components/projects/project_section"
import * as THREE from "three";
import {useScroll, useTransform} from "motion/react";

const Model = React.forwardRef(({width}, {screenSection, transitionSection})=>{
    const {nodes, materials} = useGLTF('/models/Laptop.glb');
    const material = new THREE.MeshBasicMaterial( {color: "#000"} );


    const modelScale = useMemo(() => {
        let scaleFactor; // Adjust the model size for small screens (e.g., below 768px)
        if(window.innerWidth >= 925){
            scaleFactor = 1;
        }
        else{
            scaleFactor = window.innerWidth/1000;
        }
        return [scaleFactor, scaleFactor, scaleFactor];
    }, [window.innerWidth]);


    return (
        <e.group theatreKey="Model" dispose={null} scale={modelScale}>
            <group position={[0, -0.007, -2.37]} scale={[1.02, 1, 1.14]}>
                <mesh geometry={nodes.Cube585.geometry} material={materials['bottom body']} />
                <mesh geometry={nodes.Cube585_1.geometry} material={materials.rubber} />
            </group>
            <group position={[400, -0.008, -402.35]} scale={[1.02, 1, 1.14]}>
                <mesh geometry={nodes.Cube584.geometry} material={materials['rubber.001']} />
                <mesh geometry={nodes.Cube584_1.geometry} material={materials['bottom body']} />
            </group>
            <mesh geometry={nodes.Cube789.geometry} material={materials['Material.006']} position={[-0.024, 0.231, -0.976]} scale={[3.67, 0.062, 1.14]} />
            <group position={[0, 0.007, 1.53]} scale={[1.02, 1, 1.14]}>
                <mesh geometry={nodes.Cube476.geometry} material={materials['bottom body']} />
                <mesh geometry={nodes.Cube476_1.geometry} material={materials.rubber} />
            </group>
            <mesh geometry={nodes.Cube786.geometry} material={materials.sound} position={[-0.063, 0.278, -2.547]} rotation={[-Math.PI / 2, 0, Math.PI]} scale={[4.07, 2.683, 0.134]} />
            <mesh geometry={nodes['b&o_logo1'].geometry} material={materials['b&o logo1']} position={[3.067, 0.325, -2.549]} scale={[0.14, 0.2, 0.14]} />
            <mesh geometry={nodes.geforec_gtx_logo.geometry} material={materials['geforec gtx2']} position={[3.079, 0.325, 1.24]} scale={[0.4, 0.323, 0.4]} />
            <mesh geometry={nodes.inter_i7_logo.geometry} material={materials['250px-core_i7_logo_(2015)']} position={[3.079, 0.324, 0.727]} scale={0.4} />
            <mesh geometry={nodes.Cube784.geometry} material={materials['usb black']} position={[-3.781, 0.254, -1.744]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.096, 0.012, 0.113]} />
            <mesh geometry={nodes.Cube783.geometry} material={materials['usb metal']} position={[-3.801, 0.221, -1.743]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.064, 0.062, 0.147]} />
            <mesh geometry={nodes.Cube782.geometry} material={materials['usb metal']} position={[-3.801, 0.221, -2.112]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.064, 0.062, 0.147]} />
            <mesh geometry={nodes.Cube781.geometry} material={materials['usb black']} position={[-3.781, 0.254, -2.113]} rotation={[-Math.PI, 0, -Math.PI]} scale={[0.096, 0.012, 0.113]} />
            <mesh geometry={nodes.Cube764.geometry} material={materials['usb black']} position={[3.779, 0.214, -1.582]} scale={[0.096, 0.008, 0.113]} />
            <mesh geometry={nodes.Cube763.geometry} material={materials['usb metal']} position={[3.799, 0.221, -1.579]} scale={[0.064, 0.062, 0.162]} />
            <mesh geometry={nodes.Cube762.geometry} material={materials['usb black']} position={[3.779, 0.254, -1.172]} scale={[0.096, 0.012, 0.113]} />
            <mesh geometry={nodes.Cube761.geometry} material={materials['usb metal']} position={[3.799, 0.221, -1.173]} scale={[0.064, 0.062, 0.147]} />
            <mesh geometry={nodes.speaker.geometry} material={materials.sound} position={[-0.067, 0.301, -2.549]} scale={[0.028, 0.034, 0.028]} />
            <group position={[0, 0.168, -0.339]} rotation={[-Math.PI / 2, 0, Math.PI]} scale={[3.876, 2.555, 0.158]}>
                <mesh geometry={nodes.Cube444.geometry} material={materials['bottom body']} />
                <mesh geometry={nodes.Cube444_1.geometry} material={materials.mousepad} />
                <mesh geometry={nodes.Cube444_2.geometry} material={materials['top body']} />
                <mesh geometry={nodes.Cube444_3.geometry} material={materials['lock inside']} />
            </group>
            <mesh geometry={nodes.Cube757.geometry} material={materials['power button']} position={[-3.18, 0.325, -2.565]} rotation={[0, 0, -Math.PI]} scale={[-0.003, -0.003, -0.014]} />
            <mesh geometry={nodes.Circle002.geometry} material={materials['power button']} position={[-3.18, 0.325, -2.553]} scale={[0.1, 0.062, 0.1]} />
            <mesh geometry={nodes.Cube891.geometry} material={materials.backlight} position={[1.448, 0.284, -0.467]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube890.geometry} material={materials.backlight} position={[0.807, 0.284, -0.468]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube889.geometry} material={materials.backlight} position={[0.422, 0.284, -0.468]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube888.geometry} material={materials.backlight} position={[0.038, 0.284, -0.468]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube887.geometry} material={materials.backlight} position={[-0.345, 0.284, -0.468]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube886.geometry} material={materials.backlight} position={[-0.728, 0.284, -0.468]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube885.geometry} material={materials.backlight} position={[-1.107, 0.284, -0.468]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube884.geometry} material={materials.backlight} position={[-1.484, 0.284, -0.468]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube883.geometry} material={materials.backlight} position={[-1.857, 0.284, -0.468]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube882.geometry} material={materials.backlight} position={[-2.234, 0.284, -0.468]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube881.geometry} material={materials.backlight} position={[-2.608, 0.284, -0.468]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube880.geometry} material={materials.backlight} position={[1.709, 0.284, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube879.geometry} material={materials.backlight} position={[1.342, 0.284, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube878.geometry} material={materials.backlight} position={[0.98, 0.284, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube877.geometry} material={materials.backlight} position={[0.618, 0.284, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube876.geometry} material={materials.backlight} position={[0.259, 0.284, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube875.geometry} material={materials.backlight} position={[-0.103, 0.284, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube874.geometry} material={materials.backlight} position={[-0.463, 0.284, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube873.geometry} material={materials.backlight} position={[-0.824, 0.284, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube872.geometry} material={materials.backlight} position={[-1.185, 0.284, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube871.geometry} material={materials.backlight} position={[-1.541, 0.284, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube870.geometry} material={materials.backlight} position={[-1.912, 0.284, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube869.geometry} material={materials.backlight} position={[-2.289, 0.284, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube868.geometry} material={materials.backlight} position={[-2.665, 0.284, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube867.geometry} material={materials.backlight} position={[-3.022, 0.284, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube866.geometry} material={materials.backlight} position={[1.578, 0.284, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube865.geometry} material={materials.backlight} position={[1.078, 0.284, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube864.geometry} material={materials.backlight} position={[0.706, 0.284, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube863.geometry} material={materials.backlight} position={[0.332, 0.284, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube862.geometry} material={materials.backlight} position={[-0.044, 0.284, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube861.geometry} material={materials.backlight} position={[-0.419, 0.284, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube860.geometry} material={materials.backlight} position={[-0.796, 0.284, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube859.geometry} material={materials.backlight} position={[-1.17, 0.284, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube858.geometry} material={materials.backlight} position={[-1.54, 0.284, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube857.geometry} material={materials.backlight} position={[-1.911, 0.284, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube856.geometry} material={materials.backlight} position={[-2.289, 0.284, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube855.geometry} material={materials.backlight} position={[-2.665, 0.284, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube854.geometry} material={materials.backlight} position={[-3.042, 0.284, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube853.geometry} material={materials.backlight} position={[1.668, 0.284, -1.218]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube852.geometry} material={materials.backlight} position={[1.257, 0.284, -1.218]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube851.geometry} material={materials.backlight} position={[0.882, 0.284, -1.218]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube850.geometry} material={materials.backlight} position={[0.51, 0.284, -1.218]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube849.geometry} material={materials.backlight} position={[0.134, 0.284, -1.218]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube848.geometry} material={materials.backlight} position={[-0.238, 0.284, -1.218]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube847.geometry} material={materials.backlight} position={[-0.619, 0.284, -1.218]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube846.geometry} material={materials.backlight} position={[-0.996, 0.284, -1.218]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube845.geometry} material={materials.backlight} position={[-1.371, 0.284, -1.218]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube844.geometry} material={materials.backlight} position={[-1.748, 0.284, -1.218]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube843.geometry} material={materials.backlight} position={[-2.117, 0.284, -1.218]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube842.geometry} material={materials.backlight} position={[-2.488, 0.284, -1.218]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube841.geometry} material={materials.backlight} position={[-2.869, 0.284, -1.218]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube840.geometry} material={materials.backlight} position={[0.99, 0.284, -0.838]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube839.geometry} material={materials.backlight} position={[0.614, 0.284, -0.838]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube838.geometry} material={materials.backlight} position={[0.236, 0.284, -0.838]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube837.geometry} material={materials.backlight} position={[-0.138, 0.284, -0.838]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube836.geometry} material={materials.backlight} position={[-0.517, 0.284, -0.838]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube835.geometry} material={materials.backlight} position={[-0.895, 0.284, -0.838]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube834.geometry} material={materials.backlight} position={[-1.272, 0.284, -0.838]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube833.geometry} material={materials.backlight} position={[-1.65, 0.284, -0.838]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube832.geometry} material={materials.backlight} position={[-2.023, 0.284, -0.838]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube831.geometry} material={materials.backlight} position={[-2.4, 0.284, -0.838]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube830.geometry} material={materials.backlight} position={[-2.777, 0.284, -0.838]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube829.geometry} material={materials.backlight} position={[-3.384, 0.284, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube828.geometry} material={materials.backlight} position={[-3.298, 0.284, -1.218]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube827.geometry} material={materials.backlight} position={[-3.251, 0.284, -0.838]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube826.geometry} material={materials.backlight} position={[-3.166, 0.284, -0.468]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube825.geometry} material={materials.backlight} position={[1.539, 0.284, -0.838]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube824.geometry} material={materials.backlight} position={[-3.367, 0.284, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube823.geometry} material={materials.backlight} position={[1.332, 0.284, -0.098]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube822.geometry} material={materials.backlight} position={[0.582, 0.284, -0.098]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube821.geometry} material={materials.backlight} position={[0.206, 0.284, -0.098]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube820.geometry} material={materials.backlight} position={[-1.015, 0.284, -0.098]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube819.geometry} material={materials.backlight} position={[-2.234, 0.284, -0.098]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube818.geometry} material={materials.backlight} position={[-2.607, 0.284, -0.098]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube817.geometry} material={materials.backlight} position={[-2.981, 0.284, -0.098]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube815.geometry} material={materials.backlight} position={[-3.351, 0.284, -0.098]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube814.geometry} material={materials.backlight} position={[0.956, 0.284, -0.098]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube813.geometry} material={materials.backlight} position={[3.277, 0.285, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube812.geometry} material={materials.backlight} position={[2.892, 0.285, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube811.geometry} material={materials.backlight} position={[2.508, 0.285, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube810.geometry} material={materials.backlight} position={[2.124, 0.285, -1.888]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube809.geometry} material={materials.backlight} position={[3.278, 0.285, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube808.geometry} material={materials.backlight} position={[2.892, 0.285, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube807.geometry} material={materials.backlight} position={[2.509, 0.285, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube806.geometry} material={materials.backlight} position={[2.125, 0.285, -1.594]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube805.geometry} material={materials.backlight} position={[2.509, 0.285, -1.218]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube804.geometry} material={materials.backlight} position={[2.125, 0.285, -1.218]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube803.geometry} material={materials.backlight} position={[3.277, 0.285, -1.028]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube802.geometry} material={materials.backlight} position={[2.125, 0.285, -0.838]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube801.geometry} material={materials.backlight} position={[2.892, 0.285, -0.838]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube800.geometry} material={materials.backlight} position={[2.892, 0.285, -1.218]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube799.geometry} material={materials.backlight} position={[2.509, 0.285, -0.838]} scale={[1.02, 1.24, 1.02]} />
            <mesh geometry={nodes.Cube797.geometry} material={materials.backlight} position={[2.509, 0.284, -0.468]} scale={[1.04, 1.265, 1.04]} />
            <mesh geometry={nodes.Cube796.geometry} material={materials.backlight} position={[2.892, 0.284, -0.468]} scale={[1.04, 1.265, 1.04]} />
            <mesh geometry={nodes.Cube795.geometry} material={materials.backlight} position={[2.125, 0.284, -0.468]} scale={[1.04, 1.265, 1.04]} />
            <mesh geometry={nodes.Cube794.geometry} material={materials.backlight} position={[2.892, 0.284, -0.097]} scale={[1.04, 1.265, 1.03]} />
            <mesh geometry={nodes.Cube793.geometry} material={materials.backlight} position={[2.316, 0.284, -0.097]} scale={[1.03, 1.265, 1.03]} />
            <mesh geometry={nodes.Cube792.geometry} material={materials.backlight} position={[1.709, 0.284, -0.097]} scale={[1.04, 1.265, 1.03]} />
            <mesh geometry={nodes.Cube791.geometry} material={materials.backlight} position={[3.277, 0.284, -0.282]} scale={[1.201, 1.265, 1.11]} />
            <mesh geometry={nodes.Cube790.geometry} material={materials['Material.001']} position={[-0.038, 0.309, -0.952]} scale={[1, 1.24, 1]} />
            <e.mesh theatreKey="Model / Screen" geometry={nodes.Hinge.geometry} material={materials['cyclindrical rod']} position={[2.802, 0.279, -2.886]} rotation={[0.051, 0, 0]}>
                <group position={[-2.785, 2.354, -0.911]}>
                    <mesh geometry={nodes.Cube001.geometry} material={materials['bottom body']} />
                    <mesh geometry={nodes.Cube001_1.geometry} material={materials['black plastic']} />
                    <mesh geometry={nodes.Cube001_2.geometry} material={materials['hp metal glass']} />
                    <mesh geometry={nodes.Cube001_3.geometry} material={materials.camera} />
                    <mesh geometry={nodes.Cube001_4.geometry} material={materials['black camera']} />
                    <mesh geometry={nodes.Cube001_5.geometry} material={materials['inside camera']} />
                    <mesh geometry={nodes['Back-Logo'].geometry} material={materials['bottom body']} position={[-0.017, -0.108, -0.018]} rotation={[1.222, 0, Math.PI]} scale={[1.4, 0.022, 1.4]} />
                    <mesh geometry={nodes.Innerplane.geometry} material={materials['remove hp logo']} position={[0.048, -0.042, 0.019]} rotation={[1.222, 0, 0]} scale={[3.659, 2.28, 2.28]} />
                   <OptimizedMesh nodes={nodes} material={material} ref={screenSection}/>
                </group>
            </e.mesh>
        </e.group>
    )
});

useGLTF.preload('/models/Laptop.glb')

const OptimizedMesh = React.forwardRef(({ nodes, material },  screenSection) => {
    const [children, setChildren] = useState([]);
    const screenRef = useRef(null);
    const [size, setSize] = useState([]);
    const { scrollYProgress: screenAnimation } = useScroll({
        target: screenSection,
        offset: ['start start', 'end end']
    });

    useEffect(() => {
        const unsubscribe = screenAnimation.on("change", (progress) => {
            if (progress > 0 && children.length === 0) {
                // Add a child when progress is > 0 and there are no children yet
                setChildren([
                    <HTMLContent key={progress} size={size} /> // Add a new HTMLContent component
                ]);

            } else if (progress === 0 && children.length !== 0) {
                setChildren([]);
            }
        });

        return () => unsubscribe();
    }, [screenAnimation, children.length]); // Dependency on both `screenAnimation` and `children.length`


    const {camera, size: viewportSize } = useThree();

    // Update the size dynamically based on mesh geometry
    useEffect(() => {
        if (screenRef.current) {
            console.log(screenRef);
            // Get the bounding box of the mesh in world space
            const bbox = new THREE.Box3().setFromObject(screenRef.current);
            const width = bbox.max.x - bbox.min.x;
            const height = bbox.max.y - bbox.min.y;

            // Convert the 3D dimensions into 2D screen space using the camera
            const topLeft = new THREE.Vector3(bbox.min.x, bbox.max.y, 0);
            const bottomRight = new THREE.Vector3(bbox.max.x, bbox.min.y, 0);
            // Project these 3D points to screen space
            const topLeftScreen = topLeft.project(camera);
            const bottomRightScreen = bottomRight.project(camera);

            // Map the projected 3D coordinates to 2D screen space (pixels)
            const widthInPixels = Math.abs(bottomRightScreen.x - topLeftScreen.x) * viewportSize.width;
            const heightInPixels = Math.abs(topLeftScreen.y - bottomRightScreen.y) * viewportSize.height;

            console.log(widthInPixels);
            console.log(heightInPixels);
            // Set the size of the HTML element
            setSize([widthInPixels, heightInPixels]);
            
        }
    }, [nodes,camera, viewportSize]);

    return (
        <e.mesh
            theatreKey="Model / Screen / Desktop"
            geometry={nodes.Screen.geometry}
            material={material}
            rotation={[-Math.PI / 9, 0, 0]}
            scale={[3.875, 2.578, 0.056]}
            ref={screenRef}
        >
            {children}
        </e.mesh>
    );
});

const HTMLContent = (size)=>{
    return(
        <Html     
        >
            <div  className="bg-red-800 inline-block min-h-full min-w-full overflow-hidden" 
                style={{
                    overscrollBehaviorY:"none",
                    opacity:1, 
                    overflowY:"auto", 
                    width: `${size[0]}px`, 
                    height: `${size[1]}px` 
                }} 
            >

                <h1>Hello, World</h1>
            </div>
        </Html>
    );
}


export default Model;
