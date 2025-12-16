import FeaturedPostSection from "@/components/blog/featured_posts"
import AllPostsSection from "@/components/blog/all_posts"


// NEW BLOG NAME:
// The Byte Stream

export default function Blog() {
    return (
        <div className="max-w-8xl mx-auto p-8 space-y-8 rounded-lg shadow-lg">
            <div className="flex flex-col gap-16">
                
                {/* 1. Featured Section with Randomized Grid */}
                <FeaturedPostSection />

                {/* Separator */}
                <div className="border-t border-zinc-700 mx-4 md:mx-0"></div>

                {/* 2. All Posts Section with Search, Filter, and Pagination */}
                <AllPostsSection />
            </div>
        </div>
    );
}
