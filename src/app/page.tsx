import {Welcome} from "../components/welcome/welcome";
import {ProjectSection} from "../components/projects/project_section";
import {LanguageSection} from "../components/languages/languageSection";
import {ReactLenis} from "lenis/dist/lenis-react";
import "./index.css";

export const metadata = {
    title: 'Home',
    description:
    'My Portfolio',
};


export default function Home() {
    return (
        <>
            <ReactLenis root
                options={{lerp: 0.1}}
            >
                <Welcome />
                <hr className="w-1/4 mt-0 m-auto"/>
                <ProjectSection /> 
                <hr className="w-1/4 mt-0 m-auto"/>
                <LanguageSection />

            </ReactLenis>
        </>
    );
}
