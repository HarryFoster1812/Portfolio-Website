import TypewriterEffect from "./typewriter.tsx";

export const Welcome = () => {
    return (
        <>
            <section className="h-screen flex items-center justify-center z-10">
                <div className="text-center p-6 md:p-12 max-w-3xl w-full">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-stone-300 mb-2">
                        Hi, my name is
                    </h2>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                        Harry Foster
                    </h1>
                    <p className="text-lg sm:text-xl font-medium text-stone-300">
                        I'm a <TypewriterEffect />
                    </p>
                </div>
            </section>
        </>
    );
};
