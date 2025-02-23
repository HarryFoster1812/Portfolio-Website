import {Navbar} from "../../components/navbar/navbar";


export const metadata = {
  title: 'Projects',
  description:
    'My  Portfolio',
};

function sort(json_data: Array){
    return json_data;
}

export default async function Projects() {
    const data = await fetch("https://api.github.com/users/HarryFoster1812/repos"); 
    const json_data = data.json();
    const sorted_data = sort(json_data);
    return (
        <>
            <p>Projects</p>
        </>
    );
}
