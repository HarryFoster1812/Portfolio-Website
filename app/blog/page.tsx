import FeaturedPostSection from "@/components/blog/featured_posts"
import AllPostsSection from "@/components/blog/all_posts"
import {SubscribeSection} from "@/components/subscribe/subscribeSection";


export default function Blog() {
    return (
        <div className="w-full mx-auto p-8 space-y-8 rounded-lg shadow-lg">
 
            <div className="flex-1 py-20 lg:py-28 text-center" 
                  style={{ background: 'radial-gradient(circle at 50% 10%, rgba(0, 228, 255, 0.05) 0%, transparent 40%)' }}
            >
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight" style={{fontFamily:'Inter, sans-serif'}}>
                        The Cache Hit: Engineering <span className="text-transparent bg-gradient-to-r from-teal-300 via-teal-500 to-teal-600 bg-clip-text sm:inline">Deep Dives</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                        Exploring how complex systems work, from fundamental principles to real-world applications. A public log of my technical journey.
                    </p>
                </div>
            </div>
        
                
            <div className="flex flex-col gap-16">
                
                {/* Featured Section with Randomized Grid */}
                <FeaturedPostSection />

                {/* Separator */}
                <div className="border-t border-zinc-700 mx-4 md:mx-0"></div>

                {/* All Posts Section with Search, Filter, and Pagination */}
                <AllPostsSection />

                <div className="border-t border-zinc-700 mx-4 md:mx-0"></div>

                <SubscribeSection variant="blogList" />

            </div>
        </div>
    );
}
