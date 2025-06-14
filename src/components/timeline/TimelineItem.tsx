"use client";
import React from "react";

interface TimelineItemProps {
  title: string;
  description: string;
  isLeft: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  description,
  isLeft,
  isExpanded,
  onClick,
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row items-center ${
        isLeft ? "sm:flex-row-reverse" : ""
      } z-0`}
    >
      <div className="sm:w-1/2 px-4">
        <div
          className="cursor-pointer bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 border border-zinc-600 rounded-lg p-4 shadow-md hover:shadow-blue-500/20 transition-all duration-300 text-white"
          onClick={onClick}
        >
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p
            className={`text-sm text-zinc-300 transition-all duration-300 ${
              isExpanded ? "max-h-40" : "max-h-0 overflow-hidden"
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
