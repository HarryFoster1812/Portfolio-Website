import {Welcome} from "@/components/welcome/welcome";
import {ProjectSection} from "@/components/projects/project_section";
import {SubscribeSection} from "@/components/subscribe/subscribeSection";
import {TimelineSection} from "@/components/timeline/TimelineSection";
import {ExperienceSection} from "@/components/experience/experienceSection"; 
// import {LanguageSection} from "@/components/languages/languageSection";
// import {Laptop} from "@/components/laptop/Laptop";
import "./index.css";


export default function Home() {
    return (
        <>
            <Welcome />
            <hr className="w-1/4 mt-0 m-auto"/>
            {/* <Laptop/> */}
            <ProjectSection /> 
            <hr className="w-1/4 mt-0 m-auto"/>
            <ExperienceSection />
            <hr className="w-1/4 mt-0 m-auto"/>
            <TimelineSection />
            <hr className="w-1/4 mt-0 m-auto"/>
            <SubscribeSection />
        </>
    );
}
