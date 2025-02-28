export default async function DynamicProjectPage({params} : {params: Promise<{projectName:string}>}){
    const projectName = (await params).projectName;
    return (
        <>
            <h1>{projectName}</h1>
        </>
    );
}
