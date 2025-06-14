"use client"
import { useEffect, useRef, useState } from "react";

// BinaryDigit component: fades in when scrolled into view
export const BinaryDigit: React.FC<{ digit: 0 | 1; delay: number }> = ({
  digit,
  delay,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`font-mono text-green-400 opacity-0 translate-y-4 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : ""
      }`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {digit}
    </span>
  );
};
