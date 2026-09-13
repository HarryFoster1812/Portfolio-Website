"use client";

import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  company?: string;
  index: number;
  isLeft: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

export const TimelineItem = ({
  year,
  title,
  description,
  company,
  index,
  isLeft,
  isExpanded,
  onClick,
}: TimelineItemProps) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      viewport={{
        once: true,
        amount: 0.25,
      }}
      className="relative grid grid-cols-[40px_1fr] gap-5 sm:grid-cols-[1fr_40px_1fr] sm:gap-0"
    >
      {/* Left content */}
      <div
        className={`hidden sm:block ${
          isLeft ? "pr-12 text-right" : "pointer-events-none"
        }`}
      >
        {isLeft && (
          <TimelineContent
            year={year}
            title={title}
            company={company}
            description={description}
            isExpanded={isExpanded}
            onClick={onClick}
          />
        )}
      </div>

      {/* Timeline node */}
      <div className="relative flex justify-center"></div>

      {/* Right content */}
      <div
        className={`hidden sm:block ${
          !isLeft ? "pl-12" : "pointer-events-none"
        }`}
      >
        {!isLeft && (
          <TimelineContent
            year={year}
            title={title}
            company={company}
            description={description}
            isExpanded={isExpanded}
            onClick={onClick}
          />
        )}
      </div>

      {/* Mobile content */}
      <div className="sm:hidden">
        <TimelineContent
          year={year}
          title={title}
          company={company}
          description={description}
          isExpanded={isExpanded}
          onClick={onClick}
        />
      </div>
    </motion.div>
  );
};

interface TimelineContentProps {
  year: string;
  title: string;
  description: string;
  company?: string;
  isExpanded: boolean;
  onClick: () => void;
}

const TimelineContent = ({
  year,
  title,
  description,
  company,
  isExpanded,
  onClick,
}: TimelineContentProps) => {
  return (
    <button onClick={onClick} className="group w-full text-left">
      <div
        className={`rounded-2xl border p-5 transition-all duration-300 ${
          isExpanded
            ? "border-cyan-400/30 bg-cyan-400/[0.04] shadow-[0_10px_40px_rgba(34,211,238,0.08)]"
            : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.04]"
        }`}
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            {year}
          </span>

          <ChevronDown
            className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-300 ${
              isExpanded ? "rotate-180 text-cyan-400" : ""
            }`}
          />
        </div>

        <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-cyan-200">
          {title}
        </h3>

        {company && (
          <p className="mt-1 text-sm font-semibold text-cyan-400">{company}</p>
        )}

        <div
          className={`grid transition-all duration-300 ${
            isExpanded ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <p className="border-t border-white/10 pt-4 text-sm leading-7 text-zinc-400">
              {description}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
};
