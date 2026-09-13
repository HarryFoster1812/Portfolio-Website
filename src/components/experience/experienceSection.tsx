export const ExperienceSection = () => {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14">
          <h2 className="text-4xl font-bold tracking-tight text-center text-white md:text-5xl">
            My experience
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-[7px] top-2 hidden h-[calc(100%-8px)] w-px bg-zinc-800 md:block" />

          <div className="relative grid gap-8 md:grid-cols-[24px_1fr]">
            <div className="relative hidden md:block">
              <div className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 border-cyan-400 bg-zinc-950" />
            </div>

            <div className="border-b border-white/10 pb-12">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="mb-2 text-sm text-cyan-400">Matillion</p>

                  <h3 className="text-2xl font-semibold tracking-tight text-white">
                    Placement Software Engineer
                  </h3>
                </div>

                <p className="text-sm text-zinc-500 sm:pt-1">
                  July 2026 — August 2027
                </p>
              </div>

              <div className="mt-7 max-w-3xl">
                <p className="text-base leading-7 text-zinc-400">
                  Working alongside a professional engineering team to build,
                  maintain, and improve production software.
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {[
                  "Software Engineering",
                  "Production Systems",
                  "Agile",
                  "Collaboration",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
