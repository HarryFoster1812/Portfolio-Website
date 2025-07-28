import BlogList from "@/components/blog/list"

export default function Blog() {
    return (
        <div className="max-w-8xl mx-auto p-8 space-y-8 rounded-lg shadow-lg">
            <h1 className="text-4xl font-extrabold text-center text-white tracking-wide drop-shadow-md">
                My Blog
            </h1>
            <BlogList />
        </div>
    );
}



