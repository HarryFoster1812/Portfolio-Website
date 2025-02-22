import {Welcome} from "../components/welcome/welcome";
import {ProjectSection} from "../components/projects/project_section";
import "./index.css";

export const metadata: Metadata = {
    title: 'Home',
    description:
    'My Portfolio',
};


export default function Home() {
    return (
        <>
            <Welcome />
            <hr/>
           {/* <ProjectSection /> */}
        </>
    );
}
