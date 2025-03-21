import Post from "./post";
import { Project } from "../projects/project"; // Adjust import if necessary

interface ListProps {
  post_info: Project[]; // Define the expected type for the prop
}

export default function List({ post_info }: ListProps) {
  return (
    <>
      <ul className="grid grid-cols-1 xl:grid-cols-3 gap-y-10 gap-x-6 items-start p-8">
        {post_info.map((post: Project) => (
          <Post 
            key={post.name}
            image={post.image} 
            title={post.name} 
            description={post.description} 
            tags={post.tags} 
          />
        ))}
      </ul>
    </>
  );
}

