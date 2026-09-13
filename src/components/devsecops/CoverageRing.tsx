"use client";

import { useEffect, useRef, useState } from "react";

const TONE_STROKE: Record<string, string> = {
  amber: "var(--color-amber)",
  go: "var(--color-go)",
  invert: "var(--color-invert)",
  dust: "var(--color-dust)",
};

/** SVG percentage ring — fills in once scrolled into view. */
export default function CoverageRing({
  value,
  label,
  size = 72,
  strokeWidth = 3,
  tone = "amber",
  className = "",
}: {
  value: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  tone?: "amber" | "go" | "invert" | "dust";
  className?: string;
}) {
  const ref = useRef<SVGCircleElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(value, 0), 100) / 100);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-faint/25"
        />
        <circle
          ref={ref}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={TONE_STROKE[tone]}
          className={`fill-none ring-progress ${inView ? "in-view" : ""}`}
          style={
            {
              strokeDasharray: circumference,
              "--ring-circumference": circumference,
              "--ring-offset": offset,
            } as React.CSSProperties
          }
        />
      </svg>
      <div className="text-center">
        <div className="font-mono text-sm text-bone">{Math.round(value)}%</div>
        <div className="kicker text-[8px] text-faint">{label}</div>
      </div>
    </div>
  );
}
