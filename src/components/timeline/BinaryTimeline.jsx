"use client"
import { useState } from "react";

const timelineData = [
  { title: "Project Alpha", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { title: "Beta Launch", description: "Integer nec odio. Praesent libero. Sed cursus ante dapibus diam." },
  { title: "Gamma Update", description: "Donec sodales sagittis magna. Sed consequat, leo eget bibendum." },
  { title: "Delta Revision", description: "Fusce nec tellus sed augue semper porta." },
];

export const BinaryTimeline = (() => {
  const [expandedIndex, setExpandedIndex] = useState(0);

  return (
    <div className="relative px-6 sm:px-12 py-12 max-w-5xl mx-auto">
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full flex flex-col items-center z-0 text-m text-white font-mono select-none">
        {Array.from({ length: 20 }, (_, i) => (
          <span key={i}>{i % 2}</span>
        ))}
      </div>

      <div className="space-y-12 relative z-10">
        {timelineData.map((item, index) => {
          const isLeft = index % 2 === 0;
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={index}
              className={`flex flex-col sm:flex-row items-center ${
                isLeft ? "sm:flex-row-reverse" : ""
              } z-0`}
            >
              <div className="sm:w-1/2 px-4">
                <div
                  className="cursor-pointer bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 border border-zinc-600 rounded-lg p-4 shadow-md hover:shadow-blue-500/20 transition-all duration-300 text-white"
                  onClick={() =>
                    setExpandedIndex(isExpanded ? null : index)
                  }
                >
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p
                    className={`text-sm text-zinc-300 transition-all duration-300
                      max-h-40`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
});
