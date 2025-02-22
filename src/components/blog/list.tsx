export default function List({post_info}){
    return (
        <>
            <ul className="grid grid-cols-1 xl:grid-cols-3 gap-y-10 gap-x-6 items-start p-8">
                {
                    for(let i=0; i<post_info.length;i++){
                    <Post 
                        image={post_info[i].image} 
                        title={post_info[i].title} 
                        description={post_info[i].description} 
                        tags={post_info[i].tags} 
                    />
                }
            }
            </ul>
        </>
    );
}
