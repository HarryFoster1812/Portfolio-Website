"use client";

import { Project } from "./project";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export const ProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  return (
    <div className="group w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-[0_20px_80px_rgba(34,211,238,0.12)]">
      {/* Project image */}
      <div className="relative h-64 overflow-hidden md:h-80">
        <Image
          src={project.image || "https://picsum.photos/1200/600"}
          alt={`${project.name} project screenshot`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {/* Project number */}
        <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm font-semibold text-zinc-300 backdrop-blur-md">
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Project title */}
        <div className="absolute bottom-6 left-6 right-6">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
            Project
          </p>

          <h2 className="text-3xl font-bold text-white md:text-4xl">
            {project.name}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <p className="max-w-3xl text-base leading-7 text-zinc-400 md:text-lg">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="mt-6 flex flex-wrap gap-2">
          {["CSS", "JavaScript"].map((technology) => (
            <span
              key={technology}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-zinc-300 transition-colors group-hover:border-cyan-400/20 group-hover:text-cyan-200"
            >
              {technology}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={`https://github.com/HarryFoster1812/${project.link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-black transition-all duration-300 hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
          >
            <FontAwesomeIcon icon={faGithub} className="h-5 w-5" />
            View on GitHub
          </Link>

          <Link
            href={`/projects/${project.link}`}
            className="group/link inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 font-semibold text-white transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/[0.08]"
          >
            View project
          </Link>
        </div>
      </div>
    </div>
  );
};
