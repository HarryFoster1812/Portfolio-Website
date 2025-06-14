"use client";
import { useEffect, useRef, useState } from "react";
import { TimelineItem } from "./TimelineItem";
import { BinaryDigit } from "./BinaryDigit"

const timelineData = [
  {
    title: "Primary School – First Steps with Kodu",
    description:
      "Discovered an interest in logic and creativity through Kodu, a visual programming language that made building small games accessible and fun. This marked the beginning of a journey into programming.",
  },
  {
    title: "Year 7 – First Web Page",
    description:
      "Created a basic HTML web page as part of a school project. Although the page was lost, it sparked an early curiosity about how websites work and how code translates to visual output.",
  },
  {
    title: "Learning Python – First Steps in Scripting",
    description:
      "Began exploring Python through small, practical scripts. It was the first time code became a tool for solving real problems, whether automating tasks or experimenting with logic.",
  },
  {
    title: "First Python Project – Game Auto Clicker",
    description:
      "Created a simple auto-clicker to automate a game I was playing. This project introduced event simulation, control flow, and interacting with system-level operations using Python libraries.",
  },
  {
    title: "Timetable App – Always Know What’s Next",
    description:
      "Built a lightweight desktop timetable app that sat in the corner of the screen and displayed the next class based on real-time scheduling logic. It helped combine UI building with data-driven updates.",
  },
  {
    title: "Quote Collector – Local Storage from API",
    description:
      "Developed a quote-storing application that fetched random quotes from an external API and allowed users to save their favorites into a local text file. This combined web APIs, file I/O, and simple UI elements.",
  },
  {
    title: "Password Vault – Encrypted Local Storage",
    description:
      "Created a basic password manager that used a master key to encrypt and securely store credentials locally. This was my first project involving cryptography, secure storage, and user authentication concepts.",
  },
  {
    title: "C# Projects – A-Level Game Development",
    description:
      "Started using C# during A-Levels, building small games like Connect 4, Space Invaders, and a digital Monopoly clone. These projects helped reinforce object-oriented programming and game logic.",
  },
  {
    title: "Chess AI – Algorithmic Thinking in Action",
    description:
      "Designed a basic Chess AI that could calculate legal moves and respond to player input. This was a challenging project that deepened my understanding of decision trees, game theory, and optimization.",
  },
  {
    title: "University – Expanding the Horizon",
    description:
      "Currently studying Computer Science at university, gaining exposure to advanced topics like data analytics, computer engineering, operating systems, and low-level systems programming. Now applying these foundations to larger, more complex projects.",
  },
];


function textToBinary(str: string) {
  return str
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");
}

export const TimelineSection: React.FC = () => {
  const [binaryCount, setBinaryCount] = useState(20);
  const containerRef = useRef<HTMLDivElement>(null);
  const binaryRef = useRef<HTMLDivElement>(null);

  const hiddenMessage = "Hello World";
  const binaryMessage = textToBinary(hiddenMessage);
  const messageDigits = binaryMessage.split("").map((d) => parseInt(d, 10));
    
    const [expandedIndex, setExpandedIndex] = useState<number[] | null>([0]);

    const toggleIndex = (idx: number) => {
        if (!expandedIndex) {
            setExpandedIndex([idx]);
            return;
        }
        if (expandedIndex.includes(idx)) {
            setExpandedIndex(expandedIndex.filter((i) => i !== idx));
        } else {
            setExpandedIndex([...expandedIndex, idx]);
        }
    };

  useEffect(() => {
    const updateBinaryCount = () => {
      if (containerRef.current && binaryRef.current) {
        const containerHeight = containerRef.current.offsetHeight;
        const lineHeight = parseFloat(
          getComputedStyle(binaryRef.current).lineHeight || "20"
        );
        const count = Math.floor(containerHeight / lineHeight)-3;
        setBinaryCount(count);
      }
    };

    updateBinaryCount();

    const observer = new ResizeObserver(updateBinaryCount);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [expandedIndex]);
  return (
    <div ref={containerRef} className="relative px-6 sm:px-12 py-12 max-w-5xl mx-auto">
      {/* Binary Column */}
      <div
        className="
          absolute
          left-1/2
          transform
          -translate-x-1/2
          h-full
          flex
          flex-col
          items-center
          z-0
          text-green-400
          font-mono
          select-none
          text-base
          sm:text-lg
          opacity-80
          tracking-widest
          pointer-events-none
          overflow-hidden
          hidden sm:flex
        "
                ref={binaryRef}
      >
        {Array.from({ length: binaryCount }, (_, i) => {
          let digit: 0 | 1 = Math.random() < 0.5 ? 0 : 1;
          if (i < messageDigits.length) digit = messageDigits[i] as 0 | 1;
          return (
            <BinaryDigit
              key={i}
              digit={digit}
              delay={0.05}
            />
          );
        })}
      </div>

      {/* Timeline Items */}
      <div className="space-y-12 relative z-10">
        {timelineData.map((item, index) => (
          <TimelineItem
            key={index}
            title={item.title}
            description={item.description}
            isLeft={index % 2 === 0}
            isExpanded={expandedIndex.includes(index)}
            onClick={() => toggleIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};
