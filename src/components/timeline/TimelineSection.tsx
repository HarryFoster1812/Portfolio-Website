"use client";

import { useEffect, useRef, useState } from "react";
import { TimelineItem } from "./TimelineItem";
import { BinaryDigit } from "./BinaryDigit";

const timelineData = [
  {
    year: "Early Years",
    title: "First Steps with Kodu",
    description:
      "Discovered an interest in logic and creativity through Kodu, a visual programming language that made building small games accessible and fun. This was the beginning of my interest in programming.",
  },
  {
    year: "Year 7",
    title: "My First Web Page",
    description:
      "Created my first HTML web page as part of a school project. Although the original page is long gone, it sparked my curiosity about how websites work and how code can turn ideas into something visual.",
  },
  {
    year: "Early Python",
    title: "Learning to Automate",
    description:
      "Started learning Python through small scripts and experiments. Programming became more than something interesting to learn it became a tool for solving problems and automating repetitive tasks (like homework...).",
  },
  {
    year: "First Project",
    title: "Game Auto Clicker",
    description:
      "Built an auto-clicker to automate a game I was playing. This introduced me to event simulation, control flow, external libraries, and interacting with the operating system.",
  },
  {
    year: "Desktop Development",
    title: "Timetable App",
    description:
      "Built a lightweight desktop timetable application that displayed my next class in real time. This project introduced me to UI development using Tkinter.",
  },
  {
    year: "APIs & Storage",
    title: "Quote Collector",
    description:
      "Created an application that fetched random quotes from an external API and allowed users to save their favourites locally. This was an early introduction to APIs, file I/O, and persistent data.",
  },
  {
    year: "Security",
    title: "Password Vault",
    description:
      "Built a local password manager using a master key to encrypt stored credentials. This introduced me to cryptography, secure storage, and authentication concepts.",
  },
  {
    year: "A-Levels",
    title: "C# & Game Development",
    description:
      "Started working with C# during A-Levels, building projects including Connect 4, Space Invaders, and a digital Monopoly clone. These projects strengthened my understanding of object-oriented programming and larger codebases.",
  },
  {
    year: "A-Level NEA",
    title: "Chess AI",
    description:
      "Designed a Chess AI capable of calculating legal moves and responding to player input. The project pushed my understanding of algorithms, decision trees, optimisation, and problem solving.",
  },
  {
    year: "University",
    title: "Computer Science",
    description:
      "Started studying Computer Science at university, expanding into areas including data analytics, computer engineering, operating systems, and low-level systems programming.",
  },
  {
    year: "July 2026",
    title: "Placement Software Engineer",
    company: "Matillion",
    description:
      "Started my placement as a Software Engineer at Matillion, moving from university projects into a professional engineering environment and gaining experience working on real-world software alongside an experienced team.",
  },
];

function textToBinary(str: string) {
  return str
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");
}

export const TimelineSection = () => {
  const [binaryCount, setBinaryCount] = useState(20);
  const [expandedIndex, setExpandedIndex] = useState<number[]>([0]);

  const containerRef = useRef<HTMLDivElement>(null);
  const binaryRef = useRef<HTMLDivElement>(null);

  const hiddenMessage = "Hello World";
  const binaryMessage = textToBinary(hiddenMessage);
  const messageDigits = binaryMessage
    .split("")
    .map((digit) => parseInt(digit, 10));

  const toggleIndex = (index: number) => {
    setExpandedIndex((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  };

  useEffect(() => {
    const updateBinaryCount = () => {
      if (!containerRef.current || !binaryRef.current) return;

      const containerHeight = containerRef.current.offsetHeight;
      const lineHeight = parseFloat(
        getComputedStyle(binaryRef.current).lineHeight || "20",
      );

      setBinaryCount(Math.max(1, Math.floor(containerHeight / lineHeight) - 3));
    };

    updateBinaryCount();

    const observer = new ResizeObserver(updateBinaryCount);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [expandedIndex]);

  return (
    <section className="relative min-h-screen overflow-hidden px-6 py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-20 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
            The journey so far
          </p>

          <h2 className="text-5xl font-extrabold text-white md:text-6xl">
            My Story
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            From building games in Kodu to working as a Software Engineer,
            here&apos;s how I got here.
          </p>
        </div>

        <div ref={containerRef} className="relative">
          {/* Binary background */}
          <div
            ref={binaryRef}
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden -translate-x-1/2 select-none flex-col items-center overflow-hidden font-mono text-sm leading-6 tracking-[0.5em] text-green-400/20 sm:flex"
          >
            {Array.from({ length: binaryCount }, (_, index) => {
              let digit: 0 | 1 = Math.random() < 0.5 ? 0 : 1;

              if (index < messageDigits.length) {
                digit = messageDigits[index] as 0 | 1;
              }

              return <BinaryDigit key={index} digit={digit} delay={0.03} />;
            })}
          </div>

          {/* Timeline items */}
          <div className="relative space-y-8 sm:space-y-16">
            {timelineData.map((item, index) => (
              <TimelineItem
                key={`${item.title}-${index}`}
                {...item}
                isLeft={index % 2 === 0}
                isExpanded={expandedIndex.includes(index)}
                onClick={() => toggleIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
