import { Welcome } from "@/components/welcome/welcome";
import TerminalRibbon from "@/components/welcome/terminal_ribbon";
import {ProjectSection} from "@/components/projects/project_section";
import {SubscribeSection} from "@/components/subscribe/subscribeSection";
import {TimelineSection} from "@/components/timeline/TimelineSection";
import {ExperienceSection} from "@/components/experience/experienceSection"; 
import "./index.css";


export default function Home() {
    return (
        <>
            <TerminalRibbon/>
            <Welcome />
            <hr className="w-1/4 mt-0 m-auto"/>
            {/* <Laptop/> */}
            <ProjectSection /> 
            <hr className="w-1/4 mt-0 m-auto"/>
            <ExperienceSection />
            <hr className="w-1/4 mt-0 m-auto"/>
            <TimelineSection />
            <hr className="w-1/4 mt-0 m-auto"/>
            <SubscribeSection variant="home" />
        </>
    );
}
