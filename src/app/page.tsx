import {Welcome} from "../components/welcome/welcome";
import {ProjectSection} from "../components/projects/project_section";
import {LanguageSection} from "../components/languages/languageSection";
import {SubscribeSection} from "../components/subscribe/subscribeSection";
import {Laptop} from "../components/laptop/Laptop";
import "./index.css";

export const metadata = {
    title: 'Home',
    description:
    'My Portfolio',
};


export default function Home() {
    return (
        <>
            <Welcome />
            <hr className="w-1/4 mt-0 m-auto"/>
            <Laptop/>
            <ProjectSection /> 
            <hr className="w-1/4 mt-0 m-auto"/>
            <LanguageSection />
            <hr className="w-1/4 mt-0 m-auto"/>
            <SubscribeSection />
        </>
    );
}
